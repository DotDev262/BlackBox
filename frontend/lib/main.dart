import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;

void main() {
  runApp(const MyApp());
}

class City {
  final String name;
  final double lat;
  final double lng;

  const City({required this.name, required this.lat, required this.lng});
}

// --- UPDATED LIST: Top 10 Cities in India ---
const List<City> cities = [
  City(name: 'Mumbai, Maharashtra', lat: 19.0760, lng: 72.8777),
  City(name: 'Delhi, Delhi', lat: 28.6139, lng: 77.2090),
  City(name: 'Bangalore, Karnataka', lat: 12.9716, lng: 77.5946),
  City(name: 'Hyderabad, Telangana', lat: 17.3850, lng: 78.4867),
  City(name: 'Ahmedabad, Gujarat', lat: 23.0225, lng: 72.5714),
  City(name: 'Chennai, Tamil Nadu', lat: 13.0827, lng: 80.2707),
  City(name: 'Kolkata, West Bengal', lat: 22.5726, lng: 88.3639),
  City(name: 'Surat, Gujarat', lat: 21.1702, lng: 72.8311),
  City(name: 'Pune, Maharashtra', lat: 18.5204, lng: 73.8567),
  City(name: 'Jaipur, Rajasthan', lat: 26.9124, lng: 75.7873),
];

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Indian Route Calculator',
      theme: ThemeData(primarySwatch: Colors.orange, useMaterial3: true),
      home: const RouteFormScreen(),
    );
  }
}

class RouteFormScreen extends StatefulWidget {
  const RouteFormScreen({super.key});

  @override
  State<RouteFormScreen> createState() => _RouteFormScreenState();
}

class _RouteFormScreenState extends State<RouteFormScreen> {
  City? _selectedSource;
  City? _selectedDestination;
  bool _isLoading = false;
  String _apiResponse = "";

  // REMEMBER: Use your PC/Server's IP address (e.g., 192.168.1.X)
  final String _serverUrl = 'http://YOUR_SERVER_IP:8000/process-route';

  Future<void> _submitData() async {
    if (_selectedSource == null || _selectedDestination == null) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Please select both Source and Destination')),
      );
      return;
    }

    if (_selectedSource == _selectedDestination) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Source and Destination cannot be the same')),
      );
      return;
    }

    setState(() {
      _isLoading = true;
      _apiResponse = "";
    });

    try {
      final Map<String, dynamic> data = {
        "source": {
          "name": _selectedSource!.name,
          "lat": _selectedSource!.lat,
          "lng": _selectedSource!.lng
        },
        "destination": {
          "name": _selectedDestination!.name,
          "lat": _selectedDestination!.lat,
          "lng": _selectedDestination!.lng
        }
      };

      final response = await http.post(
        Uri.parse(_serverUrl),
        headers: {"Content-Type": "application/json"},
        body: jsonEncode(data),
      );

      if (response.statusCode == 200) {
        setState(() {
          _apiResponse = "Response: ${jsonDecode(response.body)}";
        });
      } else {
        setState(() {
          _apiResponse = "Error ${response.statusCode}: ${response.body}";
        });
      }
    } catch (e) {
      setState(() {
        _apiResponse = "Connection Error: $e";
      });
    } finally {
      setState(() {
        _isLoading = false;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text("Select Route (India)")),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            DropdownButtonFormField<City>(
              decoration: const InputDecoration(
                labelText: 'Source City',
                border: OutlineInputBorder(),
                prefixIcon: Icon(Icons.my_location),
              ),
              value: _selectedSource,
              items: cities.map((City city) {
                return DropdownMenuItem<City>(
                  value: city,
                  child: Text(city.name),
                );
              }).toList(),
              onChanged: (City? newValue) {
                setState(() {
                  _selectedSource = newValue;
                });
              },
            ),
            const SizedBox(height: 20),
            DropdownButtonFormField<City>(
              decoration: const InputDecoration(
                labelText: 'Destination City',
                border: OutlineInputBorder(),
                prefixIcon: Icon(Icons.location_on),
              ),
              value: _selectedDestination,
              items: cities.map((City city) {
                return DropdownMenuItem<City>(
                  value: city,
                  child: Text(city.name),
                );
              }).toList(),
              onChanged: (City? newValue) {
                setState(() {
                  _selectedDestination = newValue;
                });
              },
            ),
            const SizedBox(height: 30),
            ElevatedButton(
              onPressed: _isLoading ? null : _submitData,
              style: ElevatedButton.styleFrom(
                padding: const EdgeInsets.symmetric(vertical: 16),
                backgroundColor: Colors.orange,
                foregroundColor: Colors.white,
              ),
              child: _isLoading
                  ? const SizedBox(
                      height: 20,
                      width: 20,
                      child: CircularProgressIndicator(color: Colors.white),
                    )
                  : const Text("Send to FastAPI"),
            ),
            const SizedBox(height: 20),
            if (_apiResponse.isNotEmpty)
              Container(
                padding: const EdgeInsets.all(12),
                color: Colors.grey[100],
                child: Text(_apiResponse),
              ),
          ],
        ),
      ),
    );
  }
}