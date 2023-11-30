import styled from 'styled-components';
import { View, Text, Image, TextInput, TouchableOpacity } from 'react-native';
import Constants from 'expo-constants';

const barHeight = Constants.statusBarHeight;

export const Colors = {
    primary: '#ffffff',
    secondary: '#F1F2F6',
    tertiary: '#1F2937',
    darklight: '#9CA3AF',
    brand: '#0F81C7',
    green: '#10B981',
    red: '#EF4444',
};

const { primary, secondary, tertiary, darklight, brand, green, red } = Colors;

export const StyledContainer = styled.View`
    flex: 1;
    margin-top: 60px;
    padding: 0px 30px;
    align-items:center;
    
`

export const CompanyLogo = styled.View`
    align-items: center;
`

export const Brand = styled.Text`
font-size: 30px;
text-align: center;
font-weight: bold;
color: ${brand};
padding: 10px;

`

export const Search = styled.View`
    left: 15px;
    z-index: 1;
    top: 38px;
    position: absolute;
`