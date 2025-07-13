import socket
import struct

RADAR_MULTICAST_IP = '236.6.7.8'
RADAR_PORT = 6678

def parse_all_spokes(packet):
    spoke_size = 24 + 512  # header + data for each spoke (approximate)
    frame_hdr_size = 8
    num_spokes = (len(packet) - frame_hdr_size) // spoke_size

    spokes = []
    for i in range(num_spokes):
        offset = frame_hdr_size + i * spoke_size
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

        spokes.append((round(heading_deg, 1), round(angle_deg, 1), int(range_m)))

    return spokes

def create_nmea_sentence(heading, angle, range_m):
    sentence_body = f"PRADR,{heading:.1f},{angle:.1f},{range_m}"
    checksum = 0
    for c in sentence_body:
        checksum ^= ord(c)
    return f"${sentence_body}*{checksum:02X}"

def radar_listener():
    sock = socket.socket(socket.AF_INET, socket.SOCK_DGRAM, socket.IPPROTO_UDP)
    sock.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
    sock.bind(('', RADAR_PORT))
    mreq = struct.pack('4sL', socket.inet_aton(RADAR_MULTICAST_IP), socket.INADDR_ANY)
    sock.setsockopt(socket.IPPROTO_IP, socket.IP_ADD_MEMBERSHIP, mreq)

    print(f"Listening on {RADAR_MULTICAST_IP}:{RADAR_PORT}...")

    while True:
        packet, _ = sock.recvfrom(65535)
        spokes = parse_all_spokes(packet)
        for heading, angle, range_m in spokes:
            print(create_nmea_sentence(heading, angle, range_m))

if __name__ == "__main__":
    radar_listener()
