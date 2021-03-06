import React, {useState} from 'react';
import {View, StyleSheet} from 'react-native';
import {Input, Button} from 'react-native-elements';
import generateOTP from '../utils/generateOTP';
import isRegistered from '../utils/isRegistered';
import auth from '../utils/auth';
import {showMessage} from 'react-native-flash-message';
import Icon from 'react-native-vector-icons/FontAwesome';

const Login = props => {
  const [uid, setUID] = useState();
  const [OTP, setOTP] = useState();
  const [txnID, setTxnID] = useState();
  const [showOTP, setShowOTP] = useState(false);

  const numParser = inputText => {
    setUID(inputText.replace(/[^0-9]/g, ''));
  };

  const OTPParser = inputText => {
    setOTP(inputText.replace(/[^0-9]/g, ''));
  };

  const reset = () => {
    setUID('');
    setShowOTP(false);
    setOTP('');
    setTxnID('');
  };

  const SendOTP = async () => {
    try {
      if (uid.length < 12) {
        throw new Error('UID must be contain 12 digits');
      }
      const txnID = await generateOTP(uid);
      if (!txnID) return reset();
      setTxnID(txnID);
      showMessage({
        message: 'Success',
        description: 'OTP Sent',
        type: 'success',
      });
      setShowOTP(true);
    } catch (err) {
      reset();
      showMessage({
        message: 'Error',
        description: err.message,
        type: 'danger',
      });
    }
  };

  const SubmitOTP = async () => {
    try {
      if (OTP.length < 6) {
        throw new Error('OTP must be contain 6 digits');
      }
      const resp = await auth(txnID, uid, OTP);
      if (!resp) return reset();
      showMessage({
        message: 'Success',
        description: 'OTP Verified',
        type: 'success',
      });
      const alreadyRegistered = await isRegistered(uid);
      console.log('Already Registered', alreadyRegistered);
      if (alreadyRegistered) {
        props.navigation.replace('Home');
        return;
      }
      props.navigation.replace('PIN Generate', {
        UID: uid,
      });
    } catch (err) {
      reset();
      showMessage({
        message: 'Error',
        description: err.message,
        type: 'danger',
      });
    }
  };

  const idCard = (
    <Icon name="id-card" type="font-awesome" color="black" size={30} />
  );

  return (
    <View style={styles.screen}>
      <Input
        placeholder="Enter UID Here"
        label="UID"
        leftIcon={idCard}
        disabled={showOTP}
        maxLength={12}
        onChangeText={val => {
          numParser(val);
        }}
        keyboardType="phone-pad"
      />
      {showOTP ? (
        <Input
          placeholder="Enter OTP Here"
          label="OTP"
          maxLength={6}
          onChangeText={val => {
            OTPParser(val);
          }}
          leftIcon={{type: 'entypo', name: 'lock'}}
          keyboardType="phone-pad"
        />
      ) : null}
      <Button
        buttonStyle={styles.button}
        title={showOTP ? 'Login' : 'Get OTP'}
        onPress={() => {
          showOTP ? SubmitOTP() : SendOTP();
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  button: {
    width: 200,
    backgroundColor: 'tomato',
  },
});

export default Login;
