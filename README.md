# 🏠 MyCityHome App 🏠

<div align="center">
  <img src="https://i.imgur.com/YELZjO3.gif" alt="MyCityHome Animation" width="300">
</div>

## 📱 About MyCityHome App

MyCityHome App is a comprehensive smart home management system that allows property administrators and owners to control various IoT devices in their apartments. The application includes access management, device control, and a sophisticated logging system.

## 🚀 Main Features

### 👨‍💼 User Management
- 🔐 **Multi-level Authentication**: Support for different user roles (`admin`, `propietario`, `atic`, `dn`, etc.)
- 👤 **Session Management**: Secure login system with token-based authentication

### 🏢 Property Management
- 🏘️ **Multiple Property Support**: Manage different apartments and buildings
- 📍 **Location Tracking**: View property details including address and postal code
- 🔍 **Filtering Options**: View properties by department or role-specific access

### 🔑 Smart Lock Control
- 🚪 **Remote Door Access**: Open apartment doors remotely
- 🔢 **Code Generation**: Create temporary and permanent access codes
- 💳 **Card Management**: Add/remove access cards for door locks
- ⏰ **Schedule Access**: Set time-limited access codes

### 🏠 Smart Home Devices
- 💡 **Light Control**: Toggle lights on/off remotely (SONOFF devices)
- 🔔 **Intercom Control**: Open building entrances remotely
- 🔄 **Device Synchronization**: Manage device time synchronization
- 📱 **Device Status**: Monitor connection status of all devices

### 📊 Logging & Reporting
- 📝 **Event Tracking**: Log all device interactions and access attempts
- 📅 **Time Stamping**: Record when access codes are used
- 📱 **User Attribution**: Track which user performed each action

### 🔔 Additional Features
- 👁️ **Mirilla Server**: Digital peephole management system
- ⏱️ **Fichar System**: Employee check-in/out system
- 💬 **Suggestions System**: Collect and manage user feedback

## 💻 Technical Architecture

<div align="center">
  <img src="https://i.imgur.com/JXrCXNe.gif" alt="Architecture Animation" width="400">
</div>

### 🌐 Frontend
- **View Engine**: Handlebars templating
- **JavaScript**: Client-side functionality
- **Bootstrap**: Responsive design

### ⚙️ Backend
- **Node.js**: Server runtime
- **Express**: Web application framework
- **Socket.IO**: Real-time communication with devices
- **REST API**: Integration with property management system

### 🔌 Integrations
- **eWeLink API**: For controlling SONOFF devices
- **Custom Lock Protocol**: For smart lock communication
- **External API**: Authentication and property data

## 📡 Device Communication Flow

```
🧑‍💻 User → 📱 Web Interface → 🖥️ Node.js Server → 🔄 Socket Communication → 🏠 IoT Device
```

## 🔧 How to Use

### 👨‍💼 Admin Features
1. 🔑 Log in with admin credentials
2. 🏢 Select a property from the list
3. 💡 Control devices associated with that property
4. 🔢 Generate access codes for locks
5. 📊 View activity logs and device status

### 👨‍👩‍👧‍👦 Property Owner Features
1. 🔑 Log in with owner credentials
2. 🏠 View your properties in the "Mis Pisos" section
3. 🚪 Control access to your apartments
4. 📝 View access logs for your properties

### 🧰 Maintenance Features
1. 🔑 Log in with maintenance credentials
2. 🛠️ Access specific maintenance features
3. 🔄 Synchronize device time
4. 📱 Check device status

## 🚀 Getting Started

### Prerequisites
- Node.js installed
- Access to required APIs
- Device credentials for SONOFF devices

### Installation
1. Clone the repository
2. Run `npm install` to install dependencies
3. Configure environment variables for API endpoints
4. Start the server with `node app.js`

## 📞 Support and Contact

If you have any questions or suggestions, please submit them through the in-app suggestion form or contact the support team at support@mycityhome.com.

<div align="center">
  <img src="https://i.imgur.com/P3NSZ1v.gif" alt="Support Animation" width="250">
</div>

---

<div align="center">
  © MyCityHome 2025 - Smart Home Management
</div>
