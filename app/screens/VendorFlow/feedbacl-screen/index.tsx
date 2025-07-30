import { KeyboardWrapper, Button, Text, Screen } from 'app/design-system';
import { useVendorApi } from 'app/hooks/api/vendor-api/use-vendor-api';
import useAlert from 'app/hooks/useAlert';
import { LoaderModal } from 'app/modals';
import React, { useState } from 'react';
import { View, Pressable, StyleSheet, TextInput, ScrollView } from 'react-native';

type FeedbackOption = {
  id: string;
  label: string;
  isSelected: boolean;
};

const VendorFeedbackScreen = () => {
  const [options, setOptions] = useState<FeedbackOption[]>([
    { id: '1', label: 'Order issues', isSelected: false },
    { id: '2', label: 'Delivery issues', isSelected: false },
    { id: '3', label: 'Vendor issues', isSelected: false },
    { id: '4', label: 'Payment issues', isSelected: false },
    { id: '5', label: 'App issues', isSelected: false },
    { id: '6', label: 'Others', isSelected: false },
  ]);

  const [feedbackText, setFeedbackText] = useState('');
  const { vendorContactSupport, isProcessingLoading } = useVendorApi();
  const { successAlert, errorAlert, attentionAlert}= useAlert();

  const handleOptionSelect = (id: string) => {
    setOptions((prevOptions) =>
      prevOptions.map((option) => ({
        ...option,
        isSelected: option.id === id,
      }))
    );
  };

  const handleSubmit = () => {
    if(!feedbackText){
      attentionAlert('Please describe the issue, for better response.')
      return;
    }
    const selectedOption = options.find((option) => option.isSelected);
    console.log('Selected option:', selectedOption?.label);
    console.log('Feedback text:', feedbackText);
    vendorContactSupport({
      message: feedbackText,
      successCallback() {
        console.log('success')
      },
    })
  };

  return (
    <Screen bgColor="#fff">
      <KeyboardWrapper>
        <ScrollView contentContainerStyle={styles.container}>
          <LoaderModal isLoading={isProcessingLoading}/>
          <View style={{ rowGap: 5, marginBottom: 20 }}>
            <Text type="emphasized_medium" text="Tell us what is wrong" />
            <Text
              type="small_regular"
              color="primary40"
              text="Having an issue? let us know so we can fix it"
            />
          </View>
          <View style={styles.optionsContainer}>
            {options.map((option) => (
              <Pressable
                key={option.id}
                style={styles.optionContainer}
                onPress={() => handleOptionSelect(option.id)}>
                <Text type="small_medium" text={option.label} />
                <View style={[styles.radioButton, option.isSelected && styles.selectedBorder]}>
                  {option.isSelected && <View style={styles.selected} />}
                </View>
              </Pressable>
            ))}
          </View>

          <Text type="body_regular" text="Additional Feedback"  style={{ marginVertical: 10}} />
          <TextInput
            style={styles.input}
            multiline
            numberOfLines={4}
            placeholder="Describe the issue in details..."
            value={feedbackText}
            onChangeText={setFeedbackText}
          />

          <Button title="Submit Feedback" onPress={handleSubmit} />
        </ScrollView>
      </KeyboardWrapper>
    </Screen>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
  },
  optionsContainer: {
    marginBottom: 24,
  },
  optionContainer: {
    backgroundColor: '#F0F2F5',
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  radioButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#ddd',
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedBorder: {
    borderColor: '#F4AB19',
  },
  input: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#CED3D5',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    minHeight: 120,
    marginBottom: 24,
    textAlignVertical: 'top',
  },

  selected: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#F4AB19',
  },
});

export default VendorFeedbackScreen;
