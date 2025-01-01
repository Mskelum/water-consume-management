import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Linking } from 'react-native';

const Contact = () => {
  const email = "mskelum19@gmail.com";
  const whatsappNumber = "+94758125068";

  const openEmail = () => {
    Linking.openURL(`mailto:${email}`);
  };

  const openWhatsApp = () => {
    Linking.openURL(`https://wa.me/${whatsappNumber.replace('+', '')}`);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Contact Us</Text>
      <Text style={styles.description}>
        Welcome to our app! Track your daily water consumption and stay healthy.
        If you have any questions or need assistance, feel free to reach out to us.
      </Text>
      <View style={styles.contactSection}>
        <Text style={styles.label}>Email:</Text>
        <TouchableOpacity onPress={openEmail}>
          <Text style={styles.link}>{email}</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.contactSection}>
        <Text style={styles.label}>WhatsApp:</Text>
        <TouchableOpacity onPress={openWhatsApp}>
          <Text style={styles.link}>Chat with us</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#111827',
    padding: 20,
  },
  title: {
    fontSize: 28,
    color: '#F3F4F6',
    fontWeight: 'bold',
    marginTop: 30,
    marginBottom: 20,
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    color: '#E5E7EB',
    textAlign: 'center',
    marginBottom: 30,
    lineHeight: 24,
  },
  contactSection: {
    marginBottom: 20,
    padding: 20,
    backgroundColor: '#1F2937',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
  label: {
    fontSize: 20,
    color: '#E5E7EB',
    marginBottom: 8,
    textAlign: 'center',
  },
  link: {
    fontSize: 18,
    color: '#3B82F6',
    textDecorationLine: 'underline',
    textAlign: 'center',
  },
});

export default Contact;
