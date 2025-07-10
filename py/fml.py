import socket
import struct

UDP_IP = "0.0.0.0"   # Listen on all interfaces
UDP_PORT = 6677      # Change this to your radar's UDP port

# Create UDP socket
sock = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
sock.bind((UDP_IP, UDP_PORT))

def parse_spoke(data):
    header_len = data[0]
    angle_raw = struct.unpack_from("<H", data, 6)[0]  # angle at byte 6-7
    large_range = struct.unpack_from("<H", data, 10)[0]  # largerange at byte 10-11
    small_range = struct.unpack_from("<H", data, 14)[0]  # smallrange at byte 14-15

    # Range calculation for Halo radar
    if large_range == 0x80:
        range_meters = 0 if small_range == 0xFFFF else small_range / 4
    else:
        range_meters = (large_range * small_range) / 512

    angle_degrees = angle_raw * 360 / 4096
    return range_meters, angle_degrees

print(f"Listening for radar data on {UDP_IP}:{UDP_PORT}")

while True:
    data, addr = sock.recvfrom(65536)  # Read UDP packet
    print(f"Received {len(data)} bytes from {addr}")

    # Skip the first 8 bytes (frame header)
    offset = 8
    spoke_size = 24 + 512  # 24-byte header + 512 bytes of data per spoke

    while offset + spoke_size <= len(data):
        spoke = data[offset:offset + spoke_size]
        range_meters, angle_deg = parse_spoke(spoke)
        print(f"Range: {range_meters:.2f} m, Azimuth: {angle_deg:.2f}°")
        offset += spoke_size
