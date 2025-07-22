import socket
import struct
import csv
import time

RADAR_IP = "236.6.7.8"
RADAR_PORT = 6678
BIN_COUNT = 512
SPOKE_SIZE = BIN_COUNT
MAX_SPOKES_PER_PACKET = 32
HEADER_SIZE = 24
STRENGTH_THRESHOLD = 30
METERS_TO_NM = 1 / 1852

def extract_uint16_le(data, offset):
    return data[offset] | (data[offset + 1] << 8)

def calculate_range_meters(large_range, small_range):
    if large_range in (0x80, 0xFFFF):
        if small_range in (0xFFFF, 0x0000):
            return 0
        else:
            return small_range
    else:
        return int((large_range * small_range) / 512)

def parse_spoke(data, spoke_offset, angle_raw, large_range, small_range):
    if spoke_offset + SPOKE_SIZE > len(data):
        return None
    strength_data = data[spoke_offset:spoke_offset + SPOKE_SIZE]
    range_meters = calculate_range_meters(large_range, small_range)
    bin_resolution = range_meters / BIN_COUNT  # meters per bin

    target_ranges = [
        round(i * bin_resolution * METERS_TO_NM, 2)
        for i in range(len(strength_data))
        if strength_data[i] >= STRENGTH_THRESHOLD
    ]
    azimuth = angle_raw * 360 / 4096
    return azimuth, target_ranges

def parse_radar_packet(data):
    spokes = []
    if len(data) < HEADER_SIZE:
        return spokes

    base_angle_raw = extract_uint16_le(data, 16)
    large_range = extract_uint16_le(data, 8)
    small_range = extract_uint16_le(data, 12)

    for i in range(MAX_SPOKES_PER_PACKET):
        spoke_offset = HEADER_SIZE + i * SPOKE_SIZE
        if spoke_offset + SPOKE_SIZE > len(data):
            break
        angle_raw = (base_angle_raw + i) % 4096
        result = parse_spoke(data, spoke_offset, angle_raw, large_range, small_range)
        if result:
            spokes.append(result)
    return spokes

def start_listener_and_buffer_sweep():
    sock = socket.socket(socket.AF_INET, socket.SOCK_DGRAM, socket.IPPROTO_UDP)
    sock.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
    sock.bind(('', RADAR_PORT))
    mreq = struct.pack("=4sl", socket.inet_aton(RADAR_IP), socket.INADDR_ANY)
    sock.setsockopt(socket.IPPROTO_IP, socket.IP_ADD_MEMBERSHIP, mreq)

    print(f"📡 Listening on {RADAR_IP}:{RADAR_PORT}...")

    sweep_buffer = {}
    last_azimuth = 0
    sweep_count = 0

    while True:
        try:
            data, _ = sock.recvfrom(65535)
            spokes = parse_radar_packet(data)

            for azimuth, ranges in spokes:
                if azimuth < last_azimuth:  # Azimuth wraparound = new sweep
                    sweep_count += 1
                    filename = f"sweep_{sweep_count}.csv"
                    print(f"💾 Saving sweep #{sweep_count} to {filename} with {len(sweep_buffer)} spokes")
                    with open(filename, mode='w', newline='') as file:
                        writer = csv.writer(file)
                        writer.writerow(["Azimuth (deg)", "Target Range (NM)"])
                        for az, rlist in sorted(sweep_buffer.items()):
                            for rng in rlist:
                                writer.writerow([round(az, 2), round(rng, 2)])
                    sweep_buffer = {}
                sweep_buffer[azimuth] = ranges
                last_azimuth = azimuth
        except Exception as e:
            print(f"Error: {e}")

if __name__ == "__main__":
    start_listener_and_buffer_sweep()
