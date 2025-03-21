![alt text](https://github.com/JardinaGomez/TraduCode/blob/main/imgs/extension.png "TraduCode Extension Logo, A colorful T,")
# **Introduction**


TraduCode is a Chrome extension that automatically translates programming code and instructions from English to Spanish. It's designed to help Spanish-speaking developers and programming students better understand code examples encountered while browsing programming websites, tutorials, and documentation.
The extension works by identifying code blocks on web pages and translating programming keywords (such as if, for, while, etc.) into their Spanish equivalents, helping users understand programming concepts in their native language while maintaining the integrity of the code structure.

- As of right now the target programming language to translate is Python, keeping the scope small and focused allowing for faster building and testing. Choose Python as it is the most beginner friendly and widely used to target a large audience. 

## **Key Features**
- Real-time translation of programming keywords in code blocks
  ![alt text](https://github.com/JardinaGomez/TraduCode/blob/main/imgs/prototype2.png "Image of a python code snippet and a poput with the same code but keywords, in blue, translated to Spanish")
- Tooltip display of translated code on hover
- Toggle translation on/off with a single click
- Support for Python( for now)
- Built-in ad blocking for a cleaner browsing experience
- Works across frames and embedded content
 
## **Installation**
  
### **Requirements**
- Google Chrome browser (version 88 or higher)
- Microsoft Edge (version 88 or higher) or any Chromium-based browser supporting Manifest V3

### **Manual Installation (Developer Mode)**
1. Download the extension files from the GitHub repository or unzip the provided package
2. Open Chrome and navigate to chrome://extensions/
3. Enable "Developer mode" using the toggle in the top-right corner
4. Click "Load unpacked" and select the folder containing the extension files
5. The TraduCode icon will appear in your browser's extension toolbar

### **Getting Started**

After installation, TraduCode is enabled by default. Visit any website containing code examples to see the extension in action.

## **Using the Extension**

1. Enabling/Disabling Translation: Click the TraduCode icon in your browser toolbar to open the popup, then click the "Enable Translations" or "Disable Translations" button to toggle the extension's functionality.
2. Viewing Translated Code: When visiting a page with code examples:
  - Hover over any code block to see a tooltip with the translated version
  - Code keywords like if, else, for, and while will be translated to their Spanish equivalents (sí, sino, para, mientras)
  - The original code remains unchanged on the page
3. Supported Websites: TraduCode works currenlty on (one) site. 
- GeeksforGeeks

## **Data Privacy**

TraduCode respects user privacy:
- No user data is collected or transmitted
- All translations happen locally in the browser
- No external services are used for translation
  
## **Contributing**
  
We welcome contributions to improve TraduCode!

### **Contribution Guidelines**

1. Code Style:
  - Follow the established code style
  - Use descriptive variable and function names
  - Add comments for complex logic
2. Pull Request Process:
  - Fork the repository
  - Create a feature branch (git checkout -b feature/amazing-feature)
  - Commit your changes (git commit -m 'Add some amazing feature')
  - Push to the branch (git push origin feature/amazing-feature)
  - Open a Pull Request
3. Adding New Features:
  - Focus on one feature per pull request
  - Include tests for new functionality
  - Update documentation to reflect changes

