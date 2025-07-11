import socket
import struct
import json

RADAR_IP = "236.6.7.8"  # Multicast group
RADAR_PORT = 6678

def extract_uint16_le(data, offset):
    return data[offset] | (data[offset + 1] << 8)

def parse_radar_packet(data):
    if len(data) < 24:
        return {"error": "Packet too short"}

    header_len = data[8]
    status = data[9]
    scan_number = extract_uint16_le(data, 10)
    angle_raw = extract_uint16_le(data, 16)
    heading_raw = extract_uint16_le(data, 18)
    large_range = extract_uint16_le(data, 20)
    small_range = extract_uint16_le(data, 22)

    azimuth_degrees = angle_raw * 360 / 4096

    # Halo-specific range calculation
    if large_range == 0x80:
        if small_range == 0xFFFF:
            range_meters = 0
        else:
            range_meters = small_range / 4
    else:
        range_meters = (large_range * small_range) / 512

    return {
        "header_length": header_len,
        "status": status,
        "scan_number": scan_number,
        "azimuth_raw": angle_raw,
        "azimuth_degrees": round(azimuth_degrees, 2),
        "heading_raw": heading_raw,
        "range_large": large_range,
        "range_small": small_range,
        "range_meters": round(range_meters, 2),
        "doppler": None
    }

def start_listener():
    # Create UDP socket
    sock = socket.socket(socket.AF_INET, socket.SOCK_DGRAM, socket.IPPROTO_UDP)
    sock.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)

    # Bind to all interfaces on RADAR_PORT
    sock.bind(('', RADAR_PORT))

    # Join multicast group
    mreq = struct.pack("=4sl", socket.inet_aton(RADAR_IP), socket.INADDR_ANY)
    sock.setsockopt(socket.IPPROTO_IP, socket.IP_ADD_MEMBERSHIP, mreq)

    print(f"Listening on {RADAR_IP}:{RADAR_PORT}")

    while True:
        try:
            data, addr = sock.recvfrom(65535)
            radar_data = parse_radar_packet(data)
            print(json.dumps(radar_data, indent=2))
        except Exception as e:
            print(f"Error: {e}")

if __name__ == "__main__":
    start_listener()
