import socket
import struct
import json

RADAR_IP = "236.6.7.8"  # Multicast group
RADAR_PORT = 6678
SERVER_IP = "134.199.202.20"  # Replace with your server's IP
SERVER_PORT = 5005           # Replace with your server's port
DISPLAY_EVERY_N_PACKETS = 100  # Limit console output frequency

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

    # Convert to nautical miles
    range_nm = range_meters / 1852

    return {
        "header_length": header_len,
        "status": status,
        "scan_number": scan_number,
        "azimuth_raw": angle_raw,
        "azimuth_degrees": round(azimuth_degrees, 2),
        "heading_raw": heading_raw,
        "range_large": large_range,
        "range_small": small_range,
        "range_nm": round(range_nm, 2),
        "doppler": None
    }

def start_listener():
    # Create UDP socket for receiving radar data
    radar_sock = socket.socket(socket.AF_INET, socket.SOCK_DGRAM, socket.IPPROTO_UDP)
    radar_sock.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
    radar_sock.bind(('', RADAR_PORT))

    # Join multicast group
    mreq = struct.pack("=4sl", socket.inet_aton(RADAR_IP), socket.INADDR_ANY)
    radar_sock.setsockopt(socket.IPPROTO_IP, socket.IP_ADD_MEMBERSHIP, mreq)

    # Create UDP socket for sending data to the server
    server_sock = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)

    print(f"Listening on {RADAR_IP}:{RADAR_PORT}, sending to {SERVER_IP}:{SERVER_PORT}")

    packet_count = 0

    while True:
        try:
            data, addr = radar_sock.recvfrom(65535)
            radar_data = parse_radar_packet(data)
            packet_count += 1

            # Send data to server
            server_message = json.dumps(radar_data)
            server_sock.sendto(server_message.encode(), (SERVER_IP, SERVER_PORT))

            # Optional console log
            if packet_count % DISPLAY_EVERY_N_PACKETS == 0:
                print(server_message)

        except Exception as e:
            print(f"Error: {e}")

if __name__ == "__main__":
    start_listener()
