import socket
import struct

# Radar multicast group and port
MCAST_GRP = '236.6.7.8'
MCAST_PORT = 6677  # Update this to match your radar's UDP port

# Create UDP socket
sock = socket.socket(socket.AF_INET, socket.SOCK_DGRAM, socket.IPPROTO_UDP)
sock.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)

# Bind to all interfaces and the radar port
sock.bind(('', MCAST_PORT))

# Join the multicast group on all interfaces
mreq = struct.pack("=4sl", socket.inet_aton(MCAST_GRP), socket.INADDR_ANY)
sock.setsockopt(socket.IPPROTO_IP, socket.IP_ADD_MEMBERSHIP, mreq)

print(f"Listening for radar data on multicast group {MCAST_GRP}:{MCAST_PORT}")

def parse_spoke(data):
    angle_raw = struct.unpack_from("<H", data, 6)[0]
    large_range = struct.unpack_from("<H", data, 10)[0]
    small_range = struct.unpack_from("<H", data, 14)[0]

    if large_range == 0x80:
        range_meters = 0 if small_range == 0xFFFF else small_range / 4
    else:
        range_meters = (large_range * small_range) / 512

    angle_deg = angle_raw * 360 / 4096
    return range_meters, angle_deg

while True:
    data, addr = sock.recvfrom(65536)
    print(f"Received {len(data)} bytes from {addr}")

    offset = 8
    spoke_size = 24 + 512

    while offset + spoke_size <= len(data):
        spoke = data[offset:offset + spoke_size]
        range_meters, angle_deg = parse_spoke(spoke)
        print(f"Range: {range_meters:.2f} m, Azimuth: {angle_deg:.2f}°"

