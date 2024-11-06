import React from 'react';
import { View, Text, TextInput, Button } from 'react-native';


const Profile: React.FC = () => {
  return(
    <View>
      <Text testID='text-title'>Perfil</Text>
      <TextInput testID='input-name' autoCorrect={false} placeholder="Nome" value="Natan" />
      <TextInput testID='input-surname' autoCorrect={false} placeholder="Sobrenome" value="Moreira" />

      <Button title='Salvar' onPress={()=>{}} />
    </View>
  );
}

export default Profile;