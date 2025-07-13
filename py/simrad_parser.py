import socket
import struct

MULTICAST_IP = "236.6.7.8"  # Replace with your radar's IP
UDP_PORT = 6678
BUFFER_SIZE = 65535

def calculate_checksum(nmea_str):
    checksum = 0
    for char in nmea_str:
        checksum ^= ord(char)
    return format(checksum, '02X')

def parse_halo_packet(data):
    # Attempt to find a spoke header using a known pattern
    spoke_offset = data.find(b'\x18\x02')  # Example pattern, may need tuning
    if spoke_offset == -1:
        return None

    # Extract azimuth from the packet
    azimuth_offset = spoke_offset + 6
    angle_raw = struct.unpack_from("<H", data, azimuth_offset)[0]
    azimuth_deg = (angle_raw / 4096.0) * 360.0

    # Assume bin data starts ~8 bytes after azimuth
    bin_data_offset = azimuth_offset + 8
    bin_data = data[bin_data_offset:]

    # Parse each bin into (azimuth, range, intensity)
    bin_size_meters = 0.125  # Adjust if needed
    results = []
    for i, bin_value in enumerate(bin_data):
        if bin_value > 0:  # Only include detected targets
            range_m = i * bin_size_meters
            results.append((azimuth_deg, range_m, bin_value))
    return results

def main():
    # Setup UDP multicast socket
    sock = socket.socket(socket.AF_INET, socket.SOCK_DGRAM, socket.IPPROTO_UDP)
    sock.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
    sock.bind(('', UDP_PORT))
    mreq = struct.pack("4sl", socket.inet_aton(MULTICAST_IP), socket.INADDR_ANY)
    sock.setsockopt(socket.IPPROTO_IP, socket.IP_ADD_MEMBERSHIP, mreq)

    print(f"Listening on {MULTICAST_IP}:{UDP_PORT}")

    while True:
        data, addr = sock.recvfrom(BUFFER_SIZE)
        results = parse_halo_packet(data)

        if results:
            for azimuth, range_m, intensity in results:
                nmea_body = f"PRADR,{azimuth:.1f},{range_m:.1f},{intensity}"
                checksum = calculate_checksum(nmea_body)
                nmea_sentence = f"${nmea_body}*{checksum}"
                print(nmea_sentence)

if __name__ == "__main__":
    main()
