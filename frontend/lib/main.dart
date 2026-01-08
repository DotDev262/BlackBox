import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;

void main() {
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'FastAPI Connector',
      theme: ThemeData(
        primarySwatch: Colors.blue,
        useMaterial3: true,
      ),
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
  final TextEditingController _sourceController = TextEditingController();
  final TextEditingController _destController = TextEditingController();

  // State variables for loading and response
  bool _isLoading = false;
  String _apiResponse = "";

  // REPLACE THIS WITH YOUR ACTUAL SERVER IP
  // If testing on a real phone, use your PC/Server's LAN IP (e.g., 192.168.1.50)
  final String _serverUrl = 'http://YOUR_SERVER_IP:8000/process-route'; 

  Future<void> _submitData() async {
    // 1. Basic Validation
    if (_sourceController.text.isEmpty || _destController.text.isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Please fill in both fields')),
      );
      return;
    }

    setState(() {
      _isLoading = true;
      _apiResponse = "";
    });

    try {
      // 2. Prepare the data
      final Map<String, String> data = {
        "source": _sourceController.text,
        "destination": _destController.text,
      };

      // 3. Make the Request
      final response = await http.post(
        Uri.parse(_serverUrl),
        headers: {"Content-Type": "application/json"},
        body: jsonEncode(data),
      );

      // 4. Handle Response
      if (response.statusCode == 200) {
        // Assuming FastAPI returns a JSON response
        final responseData = jsonDecode(response.body);
        setState(() {
          _apiResponse = "Success: ${responseData.toString()}";
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
  void dispose() {
    _sourceController.dispose();
    _destController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text("Source & Destination")),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            // SOURCE INPUT
            TextField(
              controller: _sourceController,
              decoration: const InputDecoration(
                labelText: 'Source',
                border: OutlineInputBorder(),
                prefixIcon: Icon(Icons.my_location),
              ),
            ),
            const SizedBox(height: 16),
            
            // DESTINATION INPUT
            TextField(
              controller: _destController,
              decoration: const InputDecoration(
                labelText: 'Destination',
                border: OutlineInputBorder(),
                prefixIcon: Icon(Icons.location_on),
              ),
            ),
            const SizedBox(height: 24),

            // SUBMIT BUTTON
            ElevatedButton(
              onPressed: _isLoading ? null : _submitData,
              style: ElevatedButton.styleFrom(
                padding: const EdgeInsets.symmetric(vertical: 16),
              ),
              child: _isLoading
                  ? const SizedBox(
                      height: 20,
                      width: 20,
                      child: CircularProgressIndicator(strokeWidth: 2),
                    )
                  : const Text("Submit Route"),
            ),
            
            const SizedBox(height: 20),

            // RESPONSE DISPLAY
            if (_apiResponse.isNotEmpty)
              Container(
                padding: const EdgeInsets.all(10),
                color: Colors.grey[200],
                child: Text(_apiResponse),
              ),
          ],
        ),
      ),
    );
  }
}