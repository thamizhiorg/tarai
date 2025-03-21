import React, { useState } from "react";
import { Text, View, StyleSheet, TextInput, TouchableOpacity, SafeAreaView, StatusBar, FlatList } from "react-native";
import Ionicons from '@expo/vector-icons/Ionicons';
import { router } from 'expo-router';

export default function Index() {
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [inputText, setInputText] = useState('');
  const [isLongPressing, setIsLongPressing] = useState(false);
  const [longPressTimer, setLongPressTimer] = useState<NodeJS.Timeout | null>(null);
  // Add state to track menu visibility
  const [showMenu, setShowMenu] = useState(true);

  // Static list items
  const menuItems = [
    { id: '1', title: '🎈 Sales' },
    { id: '2', title: '📦 Products' },
    { id: '3', title: '🀫 Inventory' },
    { id: '4', title: '🥁 Posts' },
    { id: '5', title: '🔗 Pages' },
    { id: '6', title: '〰️ Path' },
    { id: '7', title: '🎯 Analytics' },
    { id: '8', title: '🎮 Settings' },
    { id: '9', title: '🕹️ AI agent' },
  ];

  // Sample slash commands
  const slashCommands = [
    { id: '1', command: '/text', description: 'Add text content to the page' },
    { id: '2', command: '/image', description: 'Upload or add image from gallery' },
    { id: '3', command: '/code', description: 'Add code snippet with syntax highlighting' },
    { id: '4', command: '/table', description: 'Insert a new data table' },
    { id: '5', command: '/ai', description: 'Ask AI to generate content' },
  ];

  // Function to toggle menu visibility
  const toggleMenu = () => {
    setShowMenu(!showMenu);
  };

  const handleCommandSelect = (command: string) => {
    // Here you would implement the logic for each command
    console.log(`Selected command: ${command}`);
    setInputText(command + ' ');
    setShowSuggestions(false);
    // Additional command handling logic would go here
  };

  const handleSlashButtonPress = () => {
    // Toggle suggestions visibility instead of just showing them
    setShowSuggestions(!showSuggestions);
    
    // Only set the slash prefix if we're showing suggestions
    if (!showSuggestions) {
      setInputText('/');
    }
  };

  const handleInputChange = (text: string) => {
    setInputText(text);
    if (text === '/') {
      setShowSuggestions(true);
    } else if (text.startsWith('/')) {
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
    }
  };

  // Handle navigation to aiagents screen
  const handleAgentPress = () => {
    console.log("Navigating to aiagents");
    router.push('/aiagents');
  };

  // Handle long press using manual timers
  const handlePressIn = () => {
    const timer = setTimeout(() => {
      console.log("Long press timer completed, navigating to aiagents");
      router.push('/aiagents');
    }, 1000); // Reduced to 1 second for a more efficient experience
    
    setLongPressTimer(timer);
    setIsLongPressing(true);
  };
  
  const handlePressOut = () => {
    if (longPressTimer) {
      clearTimeout(longPressTimer);
      setLongPressTimer(null);
    }
    setIsLongPressing(false);
  };

  // Render each slash command suggestion
  const renderSuggestionItem = ({ item }: { item: { id: string, command: string, description: string } }) => (
    <TouchableOpacity 
      style={styles.suggestionItem} 
      onPress={() => handleCommandSelect(item.command)}
    >
      <Text style={styles.commandText}>{item.command}</Text>
      <Text style={styles.descriptionText}>{item.description}</Text>
    </TouchableOpacity>
  );

  // Render each page item - separated emoji and title with improved spacing
  const renderPageItem = ({ item }: { item: { id: string, title: string } }) => {
    // Split the emoji and title text
    const titleParts = item.title.split(' ');
    const emoji = titleParts[0];
    const titleText = titleParts.slice(1).join(' ');
    
    return (
      <TouchableOpacity style={styles.listItem}>
        <Text style={styles.listItemEmoji}>{emoji}</Text>
        <Text style={styles.listItemTitle}>{titleText}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      {/* Display Area with Pages List - conditionally rendered based on showMenu state */}
      {showMenu && (
        <View style={[styles.display, styles.noHeaderPadding]}>
          <FlatList
            data={menuItems}
            renderItem={renderPageItem}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.list}
            ItemSeparatorComponent={() => <View style={styles.separator} />}
          />
        </View>
      )}
      
      {/* Bottom Navigation/Input Area */}
      <View style={styles.bottomNav}>
        {/* Slash Command Suggestions */}
        {showSuggestions && (
          <View style={styles.suggestionsContainer}>
            <FlatList
              data={slashCommands}
              renderItem={renderSuggestionItem}
              keyExtractor={(item) => item.id}
              style={styles.suggestionsList}
              showsVerticalScrollIndicator={false}
            />
          </View>
        )}
        
        {/* Input Bar (Modern AI chat input design) */}
        <View style={styles.inputBar}>
          {/* Left side buttons - Slash button */}
          <TouchableOpacity style={styles.slashButton} onPress={handleSlashButtonPress}>
            <Text style={styles.slashButtonText}>/</Text>
          </TouchableOpacity>
          
          {/* Input field */}
          <TextInput 
            style={styles.textInput}
            placeholder="Type a message..."
            placeholderTextColor="#999"
            value={inputText}
            onChangeText={handleInputChange}
          />
          
          {/* Vertical divider */}
          <View style={styles.verticalDivider} />
          
          {/* Right side buttons */}
          <TouchableOpacity style={styles.iconButton}>
            <Text style={styles.buttonText}>AI</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.sendButton}>
            <Text style={styles.buttonText}>Send</Text>
          </TouchableOpacity>
        </View>
        
        {/* Agent Bar */}
        <View style={styles.agentBar}>
          <TouchableOpacity 
            style={[
              styles.minimalButton, 
              isLongPressing ? styles.buttonPressed : null
            ]}
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
            onPress={toggleMenu}  // Add onPress handler to toggle menu
          >
            <Text style={styles.buttonText}>
              ✨  {/* Changed from 'ai agent' to ✨ emoji */}
            </Text>
          </TouchableOpacity>
          
          <View style={styles.rightButtons}>
            <TouchableOpacity style={styles.iconButton}>
              <Ionicons name="play-outline" size={24} color="black" />
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.iconButton}>
              <Ionicons name="at-circle-outline" size={24} color="black" />
            </TouchableOpacity>
          </View>
        </View>
        
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'space-between', // Make sure content is distributed properly
  },
  // Header styles can be kept for future reference
  noHeaderPadding: {
    paddingTop: 10, // Add a small top padding to replace header spacing
  },
  display: {
    flex: 1,
    backgroundColor: '#fff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  list: {
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 5,
    borderRadius: 8,
    marginBottom: 4,
  },
  listItemEmoji: {
    fontSize: 20,
    marginRight: 16, // Modern spacing between emoji and title
    width: 30, // Fixed width to align all titles
    textAlign: 'center', // Center the emoji
  },
  listItemTitle: {
    fontSize: 18,
    fontWeight: '500',
    color: '#333',
    letterSpacing: 0.3,
  },
  listItemContent: {
    flex: 1,
  },
  pageInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  agentText: {
    fontSize: 14,
    color: '#666',
  },
  statusText: {
    fontSize: 14,
    color: '#666',
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  separator: {
    height: 1,
    backgroundColor: '#f0f2f5',
    marginVertical: 2,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    marginTop: 50,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  emptySubtext: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  bottomNav: {
    borderTopWidth: 1,
    borderTopColor: '#f0f2f5',
    paddingBottom: 0, // Change from 20 to 0 to remove space below agent bar
    backgroundColor: '#fff',
    position: 'absolute', // Fix the bottom navigation
    bottom: 0,           // Position at bottom
    left: 0,
    right: 0,
    zIndex: 10,          // Ensure it's above other content
  },
  inputBar: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 50,
    paddingHorizontal: 10,
    paddingVertical: 0,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f2f5',
  },
  iconButton: {
    padding: 10,
  },
  textInput: {
    flex: 1,
    height: 50,
    marginHorizontal: 10,
    paddingHorizontal: 10,
    fontSize: 16,
  },
  verticalDivider: {
    width: 1,
    height: 40,
    backgroundColor: '#f0f2f5',
    marginHorizontal: 5,
  },
  sendButton: {
    padding: 10,
  },
  buttonText: {
    fontSize: 16,
    color: '#007AFF',
  },
  agentBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f2f5',
  },
  minimalButton: {
    borderWidth: 1,
    borderColor: '#f0f2f5',
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginRight: 10,
    backgroundColor: '#fff',
  },
  minimalSquareButton: {
    borderWidth: 1,
    borderColor: '#f0f2f5',
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginRight: 10,
    width: 36,
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  rightButtons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  suggestionsContainer: {
    position: 'absolute',
    bottom: '100%',
    left: 0,
    right: 0,
    width: '100%',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#f0f2f5',
    borderRadius: 8,
    marginBottom: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    maxHeight: 250,
  },
  suggestionsList: {
    padding: 10,
    width: '100%',
  },
  suggestionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    width: '100%',
  },
  commandText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  descriptionText: {
    fontSize: 14,
    color: '#666',
    flex: 1,
    marginLeft: 10,
  },
  activeSlash: {
    color: '#007AFF',
  },
  slashButton: {
    marginLeft: 2,
    borderRadius: 6,
    backgroundColor: '#f8f8f8',
    alignItems: 'center',
    justifyContent: 'center',
    width: 40,
    height: 40,
  },
  slashButtonText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#007AFF',
  },
  buttonPressed: {
    backgroundColor: '#f0f8ff', // Light blue background to indicate pressing
    borderColor: '#007AFF',
  },
});
