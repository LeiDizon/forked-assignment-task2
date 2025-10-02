import { useIsFocused } from '@react-navigation/native';
import { StackScreenProps } from '@react-navigation/stack';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import React, { useContext, useEffect, useState } from 'react';
import { Alert, Image, StyleSheet, Text, TextInput, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import Spinner from 'react-native-loading-spinner-overlay';
import BigButton from '../components/BigButton';
import Spacer from '../components/Spacer';
import { AuthenticationContext } from '../context/AuthenticationContext';
import logoImg from '../images/logo.png';
import * as api from '../services/api';
import { getFromCache, setInCache } from '../services/caching';
import { User } from '../types/User';
import { isTokenExpired, sanitizeEmail, validateEmail } from '../utils';

export default function Login({ navigation }: StackScreenProps<any>) {
    // The authentication context is a React context that stores the user's information
    // and a function to set the user's information
    const authenticationContext = useContext(AuthenticationContext);

    // The email state is a string that stores the user's email
    const [email, setEmail] = useState('');

    // The password state is a string that stores the user's password
    const [password, setPassword] = useState('');

    // The emailIsInvalid state is a boolean that stores whether the user's email is invalid or not
    const [emailIsInvalid, setEmailIsInvalid] = useState<boolean>(false);

    // The passwordIsInvalid state is a boolean that stores whether the user's password is invalid or not
    const [passwordIsInvalid, setPasswordIsInvalid] = useState<boolean>(false);

    // The authError state is a string that stores the error message when the user tries to authenticate
    const [authError, setAuthError] = useState<string>();

    // The accessTokenIsValid state is a boolean that stores whether the access token is valid or not
    const [accessTokenIsValid, setAccessTokenIsValid] = useState<boolean>(false);

    // The isAuthenticating state is a boolean that stores whether the user is authenticating or not
    const [isAuthenticating, setIsAuthenticating] = useState<boolean>(false);

    // The isFocused state is a boolean that stores whether the screen is focused or not
    const isFocused = useIsFocused();

    useEffect(() => {
        // Get the user's information from the cache
        getFromCache('userInfo')
            .then(
                (cachedUserInfo) => {
                    // If the user's information is found in the cache, set the user's information in the authentication context
                    authenticationContext?.setValue(cachedUserInfo as User);
                },
                (error: any) => {
                    // If there is an error, log the error
                    console.log(error);
                }
            );

        // Get the access token from the cache
        getFromCache('accessToken')
            .then(
                (accessToken) => {
                    // If the access token is found in the cache and it is not expired, set the accessTokenIsValid state to true
                    if (accessToken && !isTokenExpired(accessToken as string)) setAccessTokenIsValid(true);
                },
                (error: any) => {
                    // If there is an error, log the error
                    console.log(error);
                }
            );

        // If there is an authentication error, show an alert with the error message
        if (authError) {
            Alert.alert('Authentication Error', authError, [
                { text: 'Ok', onPress: () => setAuthError(undefined) },
            ]);
        }
    }, [authError]);

    useEffect(() => {
        if (accessTokenIsValid && authenticationContext?.value) navigation.navigate('EventsMap');
    }, [accessTokenIsValid]);

    /**
     * Handles the authentication of a user
     * 
     * First, it checks if the form is valid (email and password are not empty and email is valid)
     * If the form is valid, it sets the isAuthenticating state to true
     * Then, it makes a request to the API to authenticate the user with the provided email and password
     * If the request is successful, it stores the user's information and the access token in the cache
     * It also sets the user's information in the authentication context
     * Finally, it sets the isAuthenticating state to false and navigates to the EventsMap screen
     * If there is an error, it sets the error message in the authError state and sets the isAuthenticating state to false
     */
    const handleAuthentication = () => {
        if (formIsValid()) {
            setIsAuthenticating(true);
            // Make a request to the API to authenticate the user
            api.authenticateUser(sanitizeEmail(email), password)
                .then((response) => {
                    // Store the user's information and the access token in the cache
                    setInCache('userInfo', response.data.user);
                    setInCache('accessToken', response.data.accessToken);
                    // Set the user's information in the authentication context
                    authenticationContext?.setValue(response.data.user);
                    // Set the isAuthenticating state to false
                    setIsAuthenticating(false);
                    // Navigate to the EventsMap screen
                    navigation.navigate('EventsMap');
                })
                .catch((error) => {
                    // If there is an error, set the error message in the authError state
                    if (error.response) {
                        setAuthError(error.response.data);
                    } else {
                        setAuthError('Something went wrong.');
                    }
                    // Set the isAuthenticating state to false
                    setIsAuthenticating(false);
                });
        }
    };

    const formIsValid = () => {
        const emailIsValid = !isEmailInvalid();
        const passwordIsValid = !isPasswordInvalid();
        return emailIsValid && passwordIsValid;
    };

    const isPasswordInvalid = (): boolean => {
        const invalidCheck = password.length < 6;
        setPasswordIsInvalid(invalidCheck);
        return invalidCheck ? true : false;
    };

    const isEmailInvalid = (): boolean => {
        const invalidCheck = !validateEmail(email);
        setEmailIsInvalid(invalidCheck);
        return invalidCheck ? true : false;
    };

    return (
        <LinearGradient
            start={{ x: 0.0, y: 0.0 }}
            end={{ x: 1.0, y: 1.0 }}
            colors={['#031A62', '#00A3FF']}
            style={styles.gradientContainer}
        >
            {isFocused && <StatusBar animated translucent style="light" />}
            <KeyboardAwareScrollView
                style={styles.container}
                contentContainerStyle={{
                    padding: 24,
                    flexGrow: 1,
                    justifyContent: 'center',
                    alignItems: 'stretch',
                }}
            >
                <Image
                    resizeMode="contain"
                    style={{
                        width: 240,
                        height: 142,
                        alignSelf: 'center',
                    }}
                    source={logoImg}
                />
                <Spacer size={80} />
                <View style={styles.inputLabelRow}>
                    <Text style={styles.label}>Email</Text>
                    {emailIsInvalid && <Text style={styles.error}>invalid email</Text>}
                </View>
                <TextInput
                    style={[styles.input, emailIsInvalid && styles.invalid]}
                    onChangeText={(value) => setEmail(value)}
                    onEndEditing={isEmailInvalid}
                />

                <View style={styles.inputLabelRow}>
                    <Text style={styles.label}>Password</Text>
                    {passwordIsInvalid && <Text style={styles.error}>invalid password</Text>}
                </View>
                <TextInput
                    style={[styles.input, passwordIsInvalid && styles.invalid]}
                    secureTextEntry={true}
                    onChangeText={(value) => setPassword(value)}
                    onEndEditing={isPasswordInvalid}
                />
                <Spacer size={80} />
                <BigButton style={{ marginBottom: 8 }} onPress={handleAuthentication} label="Log in" color="#FF8700" />
                <Spinner
                    visible={isAuthenticating}
                    textContent={'Authenticating...'}
                    overlayColor="#031A62BF"
                    textStyle={styles.spinnerText}
                />
            </KeyboardAwareScrollView>
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    gradientContainer: {
        flex: 1,
    },

    container: {
        flex: 1,
    },

    spinnerText: {
        fontSize: 16,
        fontFamily: 'Nunito_700Bold',
        color: '#fff',
    },

    label: {
        color: '#fff',
        fontFamily: 'Nunito_600SemiBold',
        fontSize: 15,
    },

    inputLabelRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'baseline',
        marginBottom: 4,
    },

    input: {
        backgroundColor: '#fff',
        borderWidth: 1.4,
        borderColor: '#D3E2E5',
        borderRadius: 8,
        height: 56,
        paddingTop: 16,
        paddingBottom: 16,
        paddingHorizontal: 24,
        marginBottom: 16,
        color: '#5C8599',
        fontFamily: 'Nunito_600SemiBold',
        fontSize: 15,
    },

    invalid: {
        borderColor: 'red',
    },

    error: {
        color: 'white',
        fontFamily: 'Nunito_600SemiBold',
        fontSize: 12,
    },
});