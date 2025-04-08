import numpy as np

def rotate_back_z(points, alpha):
    """
    Transforms a set of radar points back to the standard format after rotation about the z-axis.
    
    :param points: A NumPy array of shape (N, 3) where each row is (x', y', z').
    :param alpha: Rotation angle in radians (the angle by which the radar was originally rotated).
    :return: A NumPy array of shape (N, 3) with transformed (x, y, z) points.
    """
    # Create the inverse rotation matrix
    rotation_matrix = np.array([
        [np.cos(alpha), np.sin(alpha), 0],
        [-np.sin(alpha), np.cos(alpha), 0],
        [0, 0, 1]
    ])
    
    # Apply the transformation using matrix multiplication
    return np.dot(points, rotation_matrix.T)

# Example Usage
if __name__ == "__main__":
    # Example radar points (x', y', z')
    rotated_points = np.array([
        [10, 5, 2],
        [8, 3, 1],
        [7, -4, 0]
    ])
    
    alpha = np.radians(30)  # Convert degrees to radians

    # Transform back to the standard format
    original_points = rotate_back_z(rotated_points, alpha)
    
    print("Original Points (before rotation):\n", original_points)
