import React, { useState } from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { Screen , Text} from 'app/design-system';

type FAQItem = {
  id: string;
  question: string;
  answer: string;
  isExpanded: boolean;
};

const CustomerFAQScreen = () => {
  const [faqs, setFaqs] = useState<FAQItem[]>([
    {
      id: '1',
      question: 'How do I reset my password?',
      answer:
        'Go to the settings page and select "Reset Password". You will receive an email with instructions.',
      isExpanded: false,
    },
    {
      id: '2',
      question: 'Where can I find my order history?',
      answer: 'Your order history is available in the "My Orders" section of your account.',
      isExpanded: false,
    },
    {
      id: '3',
      question: 'What payment methods do you accept?',
      answer: 'We accept all major credit cards, PayPal, and Apple Pay.',
      isExpanded: false,
    },
    {
      id: '4',
      question: 'How can I contact customer support?',
      answer:
        'You can contact us 24/7 through the "Contact Us" page in the app or by emailing support@sweeftly.co.uk.',
      isExpanded: false,
    },
    {
      id: '5',
      question: 'What is your return policy?',
      answer:
        'We accept returns within 30 days of purchase. Items must be unused and in original packaging.',
      isExpanded: false,
    },
  ]);

  const toggleFAQ = (id: string) => {
    setFaqs((prevFaqs) =>
      prevFaqs.map((faq) => (faq.id === id ? { ...faq, isExpanded: !faq.isExpanded } : faq))
    );
  };

  return (
    <Screen bgColor='#fff'>
      <View style={styles.container}>
      <Text type="emphasized_medium" text="Frequently Asked Questions" style={{ marginBottom: 10}}/>
     
        {faqs.map((faq) => (
          <View key={faq.id} style={styles.faqContainer}>
            <TouchableOpacity style={styles.faqQuestion} onPress={() => toggleFAQ(faq.id)}>
              <Text type='small_medium' color='primary80' text={faq.question} />
              <Feather name={faq.isExpanded ? 'minus' : 'plus'} size={20} color="#666" />
            </TouchableOpacity>

            {faq.isExpanded && (
              <View style={styles.faqAnswer}>
                <Text  type='small_regular' color='primary40'  text={faq.answer}/>
              </View>
            )}

            <View style={styles.borderBottom} />
          </View>
        ))}
      </View>
    </Screen>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  faqContainer: {
    marginBottom: 8,
  },
  faqQuestion: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
  },
  faqAnswer: {
    paddingBottom: 16,
    paddingHorizontal: 8,
  },
  borderBottom: {
    borderBottomWidth: 0.5,
    borderBottomColor: '#e0e0e0',
  },
});

export default CustomerFAQScreen;
