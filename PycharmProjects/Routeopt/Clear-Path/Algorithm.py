
import osmnx as ox
import networkx as nx
import random

# Set coordinates (Example)
SOURCE_COORDS = (27.7028, 85.3205)  # Latitude, Longitude
DEST_COORDS = (27.7097, 85.3144)  # Latitude, Longitude


# Fetch the road network graph
def fetch_road_network(coords, distance=2000, network_type='drive'):
    return ox.graph_from_point(coords, dist=distance, network_type=network_type)


# Find nearest nodes
def find_nearest_nodes(graph, source_coords, dest_coords):
    source_node = ox.distance.nearest_nodes(graph, X=source_coords[1], Y=source_coords[0])
    dest_node = ox.distance.nearest_nodes(graph, X=dest_coords[1], Y=dest_coords[0])
    return source_node, dest_node


# Define D* class for dynamic path planning
class DStar:
    def __init__(self, graph):
        self.graph = graph
        self.obstacles = []

    def add_obstacle(self, u, v):
        """Add obstacle by removing an edge."""
        if self.graph.has_edge(u, v):
            self.graph.remove_edge(u, v)
            self.obstacles.append((u, v))
        if self.graph.has_edge(v, u):
            self.graph.remove_edge(v, u)
            self.obstacles.append((v, u))

    def replan(self, source_node, dest_node):
        """Recalculate path using A* after an obstacle is added."""
        try:
            return nx.shortest_path(self.graph, source=source_node, target=dest_node, weight='length')
        except nx.NetworkXNoPath:
            print("No path found after obstacle!")
            return []


# Main function
def main():
    print("Fetching graph...")
    graph = fetch_road_network(SOURCE_COORDS)
    print("Graph fetched.")

    print("Finding nearest nodes...")
    source_node, dest_node = find_nearest_nodes(graph, SOURCE_COORDS, DEST_COORDS)
    print(f"Source Node: {source_node}, Destination Node: {dest_node}")

    # Initialize D* algorithm
    dstar = DStar(graph)

    # Compute initial path using A*
    print("\nFinding initial path using A*...")
    initial_path = nx.shortest_path(graph, source=source_node, target=dest_node, weight='length')
    print(f"Initial Path Found: {initial_path}")

    # Simulate a roadblock by removing an edge
    print("\nAdding a roadblock...")
    blocked_edge = random.choice(list(zip(initial_path[:-1], initial_path[1:])))
    dstar.add_obstacle(*blocked_edge)
    print(f"Blocked Edge: {blocked_edge}")

    # Recompute new path after obstacle
    print("\nRecalculating path with D*...")
    new_path = dstar.replan(source_node, dest_node)

    if new_path:
        print(f"New Path Found: {new_path}")
    else:
        print("No alternative path found!")


if __name__ == "__main__":
    main()