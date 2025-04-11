
// class Graph {
//     constructor() {
//         this.graph = {};
//     }

//     addEdge(from, to, mode, direction) {
//         if (!this.graph[from]) {
//             this.graph[from] = [];
//         }
//         this.graph[from].push({ to, mode, direction });
//     }

//     findRoutes(from, to) {
//         let routes = [];
//         let visited = new Set();

//         // Use DFS to find all possible routes
//         function dfs(currentNode, path, locations, direction) {
//             if (currentNode === to) {
//                 // If the destination is reached, push the path
//                 routes.push({ path, locations, direction });
//                 return;
//             }

//             if (visited.has(currentNode)) {
//                 return;
//             }

//             visited.add(currentNode);

//             if (!this.graph[currentNode]) return;

//             for (let neighbor of this.graph[currentNode]) {
//                 // Ensure we are adding a valid transition (not breaking the rules)
//                 if (neighbor.mode) {
//                     // Add location and mode to the path
//                     let newLocations = [...locations, currentNode];
//                     let newDirection = direction ? direction : neighbor.direction; // Maintain direction if provided

//                     // Recurse to next node
//                     dfs.call(this, neighbor.to, [...path, neighbor], newLocations, newDirection);
//                 }
//             }
//         }

//         dfs.call(this, from, [], [], null);

//         return routes;
//     }

//     displayRoute(routes) {
//         if (routes.length === 0) {
//             console.log("No possible routes found.");
//             return;
//         }

//         routes.forEach(route => {
//             // Format the route output to show the path, locations, and modes
//             let routeDetails = route.path
//                 .map(edge => `${edge.mode} (${edge.direction})`)
//                 .join(' -> ');

//             let locations = route.locations.join(' -> ');

//             console.log(`Route: ${routeDetails}`);
//             console.log(`Locations Reached: ${locations} -> ${route.locations[route.locations.length - 1]}`);
//         });
//     }
// }

// // Create a new graph
// let graph = new Graph();

// // Add edges to the graph (from, to, mode of transport, direction)
// graph.addEdge('IITGN', 'Rakshashakti Circle', 'IITBusKudassan', 'upstream');
// graph.addEdge('Rakshashakti Circle', 'IITGN', 'IITBusKudassan', 'downstream');
// graph.addEdge('Rakshashakti Circle', 'Kudasan', 'IITBusKudassan', 'upstream');
// graph.addEdge('Rakshashakti Circle', 'Dholakuva', 'walking', 'upstream');
// graph.addEdge('Dholakuva', 'Rakshashakti Circle', 'walking', 'downstream');
// graph.addEdge('Dholakuva', 'GNLU', 'Metro', 'upstream');
// graph.addEdge('GNLU', 'Dholakuva', 'Metro', 'downstream');
// graph.addEdge('GNLU', 'Motera', 'Metro', 'upstream');
// graph.addEdge('Motera', 'GNLU', 'Metro', 'downstream');
// graph.addEdge('Motera', 'Visat Circle', 'walking', 'upstream');
// graph.addEdge('Visat Circle', 'Motera', 'walking', 'downstream');
// graph.addEdge('Rakshashakti Circle', 'Visat Circle', 'Metro', 'upstream');
// graph.addEdge('Visat Circle', 'Rakshashakti Circle', 'Metro', 'downstream');
// graph.addEdge('IITGN', 'Visat Circle', 'IITBusVisat', 'upstream');
// graph.addEdge('Visat Circle', 'IITGN', 'IITBusVisat', 'downstream');

// // Function to get the possible paths between locations
// function findAndDisplayRoutes(from, to) {
//     let routes = graph.findRoutes(from, to);
//     graph.displayRoute(routes);
// }

// // Test the functionality
// findAndDisplayRoutes('IITGN', 'Rakshashakti Circle');
