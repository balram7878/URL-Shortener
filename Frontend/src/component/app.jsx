import { useState, useEffect } from 'react';

const SmartTrafficDashboard = () => {
  // State for traffic data and controls
  const [intersections, setIntersections] = useState([]);
  const [selectedIntersection, setSelectedIntersection] = useState(null);
  const [trafficData, setTrafficData] = useState({});
  const [simulationRunning, setSimulationRunning] = useState(true);
  const [timeOfDay, setTimeOfDay] = useState('peak');
  const [historicalData, setHistoricalData] = useState({});
  const [cameras, setCameras] = useState([]);
  const [selectedCamera, setSelectedCamera] = useState(null);
  const [emergencyMode, setEmergencyMode] = useState(false);

  // Initialize with mock data
  useEffect(() => {
    // Generate mock intersections
    const mockIntersections = [
      { id: 1, name: "Main St & 1st Ave", congestion: 45, signalTiming: 60, location: "Downtown", vehicles: 42, avgWaitTime: 72 },
      { id: 2, name: "Oak St & Pine Ave", congestion: 72, signalTiming: 45, location: "City Center", vehicles: 68, avgWaitTime: 115 },
      { id: 3, name: "Elm St & Maple Rd", congestion: 30, signalTiming: 75, location: "Residential", vehicles: 25, avgWaitTime: 45 },
      { id: 4, name: "Broadway & 5th St", congestion: 88, signalTiming: 35, location: "Shopping District", vehicles: 92, avgWaitTime: 156 },
      { id: 5, name: "Park Ave & Union Sq", congestion: 65, signalTiming: 50, location: "Business District", vehicles: 58, avgWaitTime: 94 },
      { id: 6, name: "River Rd & Bridge St", congestion: 78, signalTiming: 40, location: "Waterfront", vehicles: 72, avgWaitTime: 128 },
    ];
    
    // Generate mock cameras
    const mockCameras = [
      { id: 1, name: "Main St Overview", location: "Main St & 1st Ave", status: "Active" },
      { id: 2, name: "Oak St Intersection", location: "Oak St & Pine Ave", status: "Active" },
      { id: 3, name: "Elm St View", location: "Elm St & Maple Rd", status: "Active" },
      { id: 4, name: "Broadway South", location: "Broadway & 5th St", status: "Maintenance" },
      { id: 5, name: "Park Ave North", location: "Park Ave & Union Sq", status: "Active" },
      { id: 6, name: "Bridge Approach", location: "River Rd & Bridge St", status: "Active" },
    ];
    
    setIntersections(mockIntersections);
    setSelectedIntersection(mockIntersections[0]);
    setCameras(mockCameras);
    setSelectedCamera(mockCameras[0]);
    
    // Generate historical data for charts
    setHistoricalData({
      labels: ['9 AM', '10 AM', '11 AM', '12 PM', '1 PM', '2 PM', '3 PM', '4 PM'],
      congestion: [65, 75, 80, 85, 75, 65, 70, 90],
      timing: [50, 45, 40, 35, 40, 45, 40, 35],
      vehicles: [120, 185, 210, 225, 195, 160, 175, 240]
    });
  }, []);

  // Simulate real-time data updates
  useEffect(() => {
    if (!simulationRunning) return;
    
    const interval = setInterval(() => {
      setIntersections(prev => prev.map(intersection => ({
        ...intersection,
        congestion: Math.max(5, Math.min(95, intersection.congestion + (Math.random() * 10 - 5))),
        signalTiming: Math.max(20, Math.min(90, intersection.signalTiming + (Math.random() * 4 - 2))),
        vehicles: Math.max(5, Math.min(120, intersection.vehicles + (Math.random() * 10 - 5))),
        avgWaitTime: Math.max(15, Math.min(180, intersection.avgWaitTime + (Math.random() * 10 - 5)))
      })));
    }, 3000);
    
    return () => clearInterval(interval);
  }, [simulationRunning]);

  // Handle signal timing adjustment
  const adjustSignalTiming = (id, newTiming) => {
    setIntersections(prev => 
      prev.map(intersection => 
        intersection.id === id 
          ? { ...intersection, signalTiming: newTiming }
          : intersection
      )
    );
    
    if (selectedIntersection && selectedIntersection.id === id) {
      setSelectedIntersection(prev => ({ ...prev, signalTiming: newTiming }));
    }
  };

  // Apply AI recommendations to all intersections
  const applyAIRecommendations = () => {
    setIntersections(prev => 
      prev.map(intersection => {
        const recommendedTiming = Math.max(20, Math.min(90, 
          intersection.signalTiming + (Math.random() * 10 - 5)
        ));
        return {
          ...intersection,
          signalTiming: recommendedTiming,
          congestion: Math.max(5, Math.min(95, intersection.congestion - 10))
        };
      })
    );
  };

  // Get congestion level class
  const getCongestionClass = (level) => {
    if (level < 40) return 'bg-green-500';
    if (level < 70) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  // Toggle emergency mode
  const toggleEmergencyMode = () => {
    setEmergencyMode(!emergencyMode);
    if (!emergencyMode) {
      // When enabling emergency mode, prioritize all signals
      setIntersections(prev => 
        prev.map(intersection => ({
          ...intersection,
          signalTiming: 90 // Maximum green light time
        }))
      );
    }
  };

  // Render the dashboard
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-blue-800 text-white shadow-lg">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <div className="bg-white p-2 rounded-lg mr-3">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
                </svg>
              </div>
              <div>
                <h1 className="text-2xl font-bold">Smart Traffic Management System</h1>
                <p className="text-blue-200">AI-Powered Urban Congestion Control</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center">
                <div className={`rounded-full w-3 h-3 mr-2 ${simulationRunning ? 'bg-green-400' : 'bg-red-400'}`}></div>
                <span>Simulation {simulationRunning ? 'Running' : 'Paused'}</span>
              </div>
              <button 
                onClick={() => setSimulationRunning(!simulationRunning)}
                className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg flex items-center"
              >
                {simulationRunning ? (
                  <>
                    <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Pause
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Start
                  </>
                )}
              </button>
            </div>
          </div>
          
          <div className="flex mt-4 space-x-4">
            <div className={`px-4 py-2 rounded-lg flex items-center ${emergencyMode ? 'bg-red-600' : 'bg-blue-600'}`}>
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <span>Emergency Mode: {emergencyMode ? 'ON' : 'OFF'}</span>
              <button 
                onClick={toggleEmergencyMode}
                className="ml-4 px-2 py-1 bg-white text-blue-800 rounded text-sm font-semibold"
              >
                {emergencyMode ? 'Disable' : 'Enable'}
              </button>
            </div>
            
            <div className="bg-blue-600 px-4 py-2 rounded-lg flex items-center">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              <span>AI Optimization: Active</span>
            </div>
            
            <div className="bg-blue-600 px-4 py-2 rounded-lg flex items-center">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>Avg. Wait Time: 98s</span>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Left Column - Intersection List */}
          <div className="lg:col-span-1 space-y-6">
            {/* Time of Day Selector */}
            <div className="bg-white rounded-lg shadow p-4">
              <h2 className="text-lg font-semibold mb-3">Simulation Controls</h2>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Time of Day</label>
                <div className="grid grid-cols-3 gap-2">
                  {['Off-Peak', 'Moderate', 'Peak'].map(period => (
                    <button
                      key={period}
                      onClick={() => setTimeOfDay(period.toLowerCase())}
                      className={`py-2 rounded ${
                        timeOfDay === period.toLowerCase() 
                          ? 'bg-blue-600 text-white' 
                          : 'bg-gray-200 hover:bg-gray-300'
                      }`}
                    >
                      {period}
                    </button>
                  ))}
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Traffic Scenario</label>
                <select className="w-full p-2 border border-gray-300 rounded-md">
                  <option>Normal Flow</option>
                  <option>Accident Reported</option>
                  <option>Special Event</option>
                  <option>Road Construction</option>
                  <option>Weather Conditions</option>
                </select>
              </div>
              
              <button 
                onClick={applyAIRecommendations}
                className="w-full mt-4 bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg font-medium flex items-center justify-center"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                Apply AI Optimization
              </button>
            </div>

            {/* Intersection List */}
            <div className="bg-white rounded-lg shadow p-4">
              <h2 className="text-lg font-semibold mb-3">Intersections</h2>
              <div className="space-y-3">
                {intersections.map(intersection => (
                  <div 
                    key={intersection.id}
                    onClick={() => setSelectedIntersection(intersection)}
                    className={`p-3 rounded-lg cursor-pointer transition-all ${
                      selectedIntersection?.id === intersection.id
                        ? 'bg-blue-100 border-l-4 border-blue-600'
                        : 'bg-gray-50 hover:bg-gray-100'
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <h3 className="font-medium">{intersection.name}</h3>
                      <div className="flex items-center">
                        <div className={`w-3 h-3 rounded-full mr-2 ${getCongestionClass(intersection.congestion)}`}></div>
                        <span className="font-bold">{intersection.congestion}%</span>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">{intersection.location}</p>
                    <div className="mt-2 flex justify-between text-sm">
                      <span>Signal: {intersection.signalTiming}s</span>
                      <span className="text-blue-600">Details →</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* System Overview */}
            <div className="bg-white rounded-lg shadow p-4">
              <h2 className="text-lg font-semibold mb-3">System Overview</h2>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-1">
                    <span>Network Efficiency</span>
                    <span className="font-bold">78%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-green-500 h-2 rounded-full" style={{width: '78%'}}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <span>Avg. Congestion</span>
                    <span className="font-bold">63%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-yellow-500 h-2 rounded-full" style={{width: '63%'}}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <span>Predicted Improvement</span>
                    <span className="font-bold">12%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-blue-500 h-2 rounded-full" style={{width: '12%'}}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Middle Column - Map and Controls */}
          <div className="lg:col-span-2 space-y-6">
            {/* Traffic Visualization */}
            <div className="bg-white rounded-lg shadow p-4">
              <div className="flex justify-between items-center mb-3">
                <h2 className="text-lg font-semibold">Traffic Network Overview</h2>
                <div className="flex space-x-2">
                  <button className="px-3 py-1 bg-gray-200 rounded-md text-sm">2D View</button>
                  <button className="px-3 py-1 bg-blue-100 text-blue-700 rounded-md text-sm">Live Map</button>
                  <button className="px-3 py-1 bg-gray-200 rounded-md text-sm">Satellite</button>
                </div>
              </div>
              <div className="bg-gray-800 h-80 rounded-lg flex items-center justify-center relative overflow-hidden">
                {/* Simplified traffic network visualization */}
                <div className="absolute inset-0 opacity-20">
                  <div className="absolute top-1/2 left-0 right-0 h-1 bg-yellow-500 transform -translate-y-1/2"></div>
                  <div className="absolute left-1/2 top-0 bottom-0 w-1 bg-yellow-500 transform -translate-x-1/2"></div>
                </div>
                
                {intersections.map((intersection, index) => {
                  const positions = [
                    { top: '25%', left: '25%' },
                    { top: '25%', left: '75%' },
                    { top: '75%', left: '25%' },
                    { top: '75%', left: '75%' },
                    { top: '50%', left: '50%' },
                    { top: '15%', left: '50%' },
                  ];
                  
                  return (
                    <div 
                      key={intersection.id}
                      className={`absolute w-12 h-12 rounded-full flex items-center justify-center text-white font-bold transform -translate-x-1/2 -translate-y-1/2 ${getCongestionClass(intersection.congestion)} ${
                        selectedIntersection?.id === intersection.id ? 'ring-4 ring-blue-400' : ''
                      }`}
                      style={positions[index]}
                      onClick={() => setSelectedIntersection(intersection)}
                    >
                      {intersection.id}
                    </div>
                  );
                })}
                
                {/* Animated vehicles */}
                <div className="absolute top-1/2 left-0 w-4 h-4 bg-red-500 rounded-full animate-ping"></div>
                <div className="absolute top-2/3 left-1/4 w-4 h-4 bg-blue-500 rounded-full animate-ping" style={{animationDelay: '0.2s'}}></div>
                <div className="absolute top-1/3 right-1/4 w-4 h-4 bg-green-500 rounded-full animate-ping" style={{animationDelay: '0.7s'}}></div>
              </div>
            </div>

            {/* Live Camera Section */}
            <div className="bg-white rounded-lg shadow p-4">
              <h2 className="text-lg font-semibold mb-3">Live Camera Feeds</h2>
              <div className="grid grid-cols-2 gap-4">
                {cameras.slice(0, 4).map(camera => (
                  <div 
                    key={camera.id} 
                    className={`border rounded-lg overflow-hidden cursor-pointer ${selectedCamera?.id === camera.id ? 'ring-2 ring-blue-500' : ''}`}
                    onClick={() => setSelectedCamera(camera)}
                  >
                    <div className="bg-gray-800 h-32 relative">
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-white text-center">
                          <div className="text-lg font-semibold">{camera.name}</div>
                          <div className="text-sm text-gray-300">{camera.location}</div>
                          <div className={`text-xs mt-2 ${camera.status === 'Active' ? 'text-green-400' : 'text-yellow-400'}`}>
                            {camera.status}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Selected Intersection Controls */}
            {selectedIntersection && (
              <div className="bg-white rounded-lg shadow p-4">
                <h2 className="text-lg font-semibold mb-3">Controls for {selectedIntersection.name}</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-medium mb-2">Traffic Metrics</h3>
                    <div className="space-y-3">
                      <div>
                        <div className="flex justify-between mb-1">
                          <span>Congestion Level</span>
                          <span className="font-bold">{selectedIntersection.congestion}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full ${getCongestionClass(selectedIntersection.congestion)}`} 
                            style={{width: `${selectedIntersection.congestion}%`}}
                          ></div>
                        </div>
                      </div>
                      
                      <div>
                        <div className="flex justify-between mb-1">
                          <span>Vehicles</span>
                          <span className="font-bold">{selectedIntersection.vehicles}</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="h-2 rounded-full bg-purple-500" 
                            style={{width: `${(selectedIntersection.vehicles / 120) * 100}%`}}
                          ></div>
                        </div>
                      </div>
                      
                      <div>
                        <div className="flex justify-between mb-1">
                          <span>Avg. Wait Time</span>
                          <span className="font-bold">{selectedIntersection.avgWaitTime}s</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="h-2 rounded-full bg-blue-500" 
                            style={{width: `${(selectedIntersection.avgWaitTime / 180) * 100}%`}}
                          ></div>
                        </div>
                      </div>
                    </div>
                    
                    <h3 className="font-medium mt-4 mb-2">Signal Timing Adjustment</h3>
                    <div className="flex items-center space-x-4">
                      <input 
                        type="range" 
                        min="20" 
                        max="90" 
                        value={selectedIntersection.signalTiming}
                        onChange={(e) => adjustSignalTiming(selectedIntersection.id, parseInt(e.target.value))}
                        className="w-full"
                      />
                      <span className="font-bold w-12">{selectedIntersection.signalTiming}s</span>
                    </div>
                    
                    <div className="mt-4 grid grid-cols-2 gap-2">
                      <button 
                        onClick={() => adjustSignalTiming(selectedIntersection.id, Math.max(20, selectedIntersection.signalTiming - 5))}
                        className="bg-blue-100 text-blue-700 py-2 rounded-lg hover:bg-blue-200"
                      >
                        -5s
                      </button>
                      <button 
                        onClick={() => adjustSignalTiming(selectedIntersection.id, Math.min(90, selectedIntersection.signalTiming + 5))}
                        className="bg-blue-100 text-blue-700 py-2 rounded-lg hover:bg-blue-200"
                      >
                        +5s
                      </button>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-medium mb-2">AI Recommendations</h3>
                    <div className="bg-blue-50 p-3 rounded-lg">
                      <div className="flex items-start">
                        <div className="bg-blue-100 p-2 rounded-full mr-3">
                          <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                          </svg>
                        </div>
                        <div>
                          <p className="font-medium">Optimization Suggested</p>
                          <p className="text-sm text-gray-600 mt-1">
                            Based on current traffic patterns, AI recommends increasing green light duration by 8 seconds.
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-4 bg-green-50 p-3 rounded-lg">
                      <div className="flex items-start">
                        <div className="bg-green-100 p-2 rounded-full mr-3">
                          <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </div>
                        <div>
                          <p className="font-medium">Predicted Impact</p>
                          <p className="text-sm text-gray-600 mt-1">
                            This change would reduce waiting time by ~22% at this intersection during current conditions.
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    <button className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-medium">
                      Apply AI Recommendation
                    </button>
                    
                    <div className="mt-4 bg-yellow-50 p-3 rounded-lg">
                      <div className="flex items-start">
                        <div className="bg-yellow-100 p-2 rounded-full mr-3">
                          <svg className="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                          </svg>
                        </div>
                        <div>
                          <p className="font-medium">Emergency Mode</p>
                          <p className="text-sm text-gray-600 mt-1">
                            {emergencyMode 
                              ? 'Emergency mode is active. All signals are prioritized.' 
                              : 'Enable emergency mode to prioritize all traffic signals.'}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Analytics and Alerts */}
          <div className="lg:col-span-1 space-y-6">
            {/* Notifications and Alerts */}
            <div className="bg-white rounded-lg shadow p-4">
              <h2 className="text-lg font-semibold mb-3">Notifications & Alerts</h2>
              <div className="space-y-3">
                <div className="bg-red-50 border border-red-200 p-3 rounded-lg">
                  <div className="flex items-start">
                    <div className="bg-red-100 p-2 rounded-full mr-3">
                      <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                      </svg>
                    </div>
                    <div>
                      <p className="font-medium">High Congestion Alert</p>
                      <p className="text-sm text-gray-600 mt-1">Broadway & 5th St experiencing 88% congestion</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-yellow-50 border border-yellow-200 p-3 rounded-lg">
                  <div className="flex items-start">
                    <div className="bg-yellow-100 p-2 rounded-full mr-3">
                      <svg className="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <p className="font-medium">Camera Maintenance</p>
                      <p className="text-sm text-gray-600 mt-1">Broadway South camera requires maintenance</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-blue-50 border border-blue-200 p-3 rounded-lg">
                  <div className="flex items-start">
                    <div className="bg-blue-100 p-2 rounded-full mr-3">
                      <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <p className="font-medium">AI Recommendation</p>
                      <p className="text-sm text-gray-600 mt-1">New optimization available for Main St & 1st Ave</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Analytics Charts */}
            <div className="bg-white rounded-lg shadow p-4">
              <h2 className="text-lg font-semibold mb-3">Performance Analytics</h2>
              <div className="space-y-6">
                <div>
                  <h3 className="font-medium mb-2">Congestion Trend</h3>
                  <div className="h-32 relative">
                    {/* Simplified chart using divs */}
                    {historicalData.congestion && (
                      <div className="flex items-end justify-between h-24 pt-4">
                        {historicalData.congestion.map((value, index) => (
                          <div key={index} className="flex flex-col items-center flex-1">
                            <div 
                              className="w-3/4 bg-blue-500 rounded-t"
                              style={{ height: `${value/2}%` }}
                            ></div>
                            <div className="text-xs mt-1">{historicalData.labels[index]}</div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
                
                <div>
                  <h3 className="font-medium mb-2">Signal Timing Efficiency</h3>
                  <div className="h-32 relative">
                    {/* Simplified chart using divs */}
                    {historicalData.timing && (
                      <div className="flex items-end justify-between h-24 pt-4">
                        {historicalData.timing.map((value, index) => (
                          <div key={index} className="flex flex-col items-center flex-1">
                            <div 
                              className="w-3/4 bg-green-500 rounded-t"
                              style={{ height: `${value}%` }}
                            ></div>
                            <div className="text-xs mt-1">{historicalData.labels[index]}</div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Traffic Forecast */}
            <div className="bg-white rounded-lg shadow p-4">
              <h2 className="text-lg font-semibold mb-3">Traffic Forecast</h2>
              <div className="bg-gray-100 p-3 rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm">Next 30 minutes:</span>
                  <span className="font-semibold text-blue-600">Improving</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Next hour:</span>
                  <span className="font-semibold text-yellow-600">Stable</span>
                </div>
                <div className="mt-3 text-xs text-gray-500">
                  Based on historical patterns and current traffic flow
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="mt-8 py-4 bg-gray-800 text-white text-center">
        <p>Smart India Hackathon 2023 | Smart Traffic Management System | AI-Powered Urban Congestion Control</p>
      </footer>
    </div>
  );
};

export default SmartTrafficDashboard;