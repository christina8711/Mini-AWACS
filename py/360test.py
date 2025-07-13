import socket
import struct

RADAR_MULTICAST_IP = '236.6.7.8'
RADAR_PORT = 6678

def parse_spoke(packet, offset):
    angle_raw = struct.unpack_from('<H', packet, offset + 6)[0]
    heading_raw = struct.unpack_from('<H', packet, offset + 8)[0]
    large_range = struct.unpack_from('<H', packet, offset + 4 + 4)[0]
    small_range = struct.unpack_from('<H', packet, offset + 4 + 6)[0]

    angle_deg = (angle_raw / 4096) * 360
    heading_deg = (heading_raw / 4096) * 360

    if large_range == 0x80:
        range_m = small_range / 4 if small_range != 0xFFFF else 0
    else:
        range_m = (large_range * small_range) / 512

    # Sanity check
    if range_m > 50000:
        range_m = 0

    return round(heading_deg, 1), round(angle_deg, 1), int(range_m)

def create_nmea_sentence(heading, angle, range_m):
    sentence_body = f"PRADR,{heading:.1f},{angle:.1f},{range_m}"
    checksum = 0
    for c in sentence_body:
        checksum ^= ord(c)
    return f"${sentence_body}*{checksum:02X}"

def radar_listener():
    spoke_size = 24 + 512
    frame_hdr_size = 8
    sweep_data = {}
    last_angle = None

    sock = socket.socket(socket.AF_INET, socket.SOCK_DGRAM, socket.IPPROTO_UDP)
    sock.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
    sock.bind(('', RADAR_PORT))
    mreq = struct.pack('4sL', socket.inet_aton(RADAR_MULTICAST_IP), socket.INADDR_ANY)
    sock.setsockopt(socket.IPPROTO_IP, socket.IP_ADD_MEMBERSHIP, mreq)

    print(f"Listening on {RADAR_MULTICAST_IP}:{RADAR_PORT}...")

    while True:
        packet, _ = sock.recvfrom(65535)
        num_spokes = (len(packet) - frame_hdr_size) // spoke_size

        for i in range(num_spokes):
            offset = frame_hdr_size + i * spoke_size
            heading, angle, range_m = parse_spoke(packet, offset)

            # Detect sweep restart when angle wraps around
            if last_angle is not None and angle < last_angle:
                print("=== Full Sweep ===")
                for a_key in sorted(sweep_data.keys()):
                    h, a, r = sweep_data[a_key]
                    print(create_nmea_sentence(h, a, r))
                print("===================")
                sweep_data.clear()

            sweep_data[round(angle, 1)] = (heading, angle, range_m)
            last_angle = angle

if __name__ == "__main__":
    radar_listener()
