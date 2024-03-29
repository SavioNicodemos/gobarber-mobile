import { useNavigation } from '@react-navigation/native';
import { FormHandles } from '@unform/core';
import { Form } from '@unform/mobile';
import * as ImagePicker from 'expo-image-picker';
import React, { useCallback, useRef } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import * as Yup from 'yup';

import api from '../../services/api';
import getValidationErrors from '../../utils/getValidationErrors';

import Button from '../../components/Button';
import Input from '../../components/Input';

import { Avatar } from '../../components/Avatar';
import { useAuth } from '../../hooks/auth';
import { Container, HeaderContainer, Title, UserAvatarButton } from './styles';

interface ProfileFormData {
  name: string;
  email: string;
  password: string;
  old_password: string;
  password_confirmation: string;
}

function Profile() {
  const { user, updateUser, signOut } = useAuth();
  const formRef = useRef<FormHandles>(null);
  const navigation = useNavigation();

  const emailInputRef = useRef<TextInput>(null);
  const oldPasswordInputRef = useRef<TextInput>(null);
  const passwordInputRef = useRef<TextInput>(null);
  const confirmPasswordInputRef = useRef<TextInput>(null);

  const handleUpdateAvatar = useCallback(
    async () => {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
      });

      if (!result.canceled) {
        const data = new FormData();

        data.append('avatar', {
          uri: result.assets[0].uri,
          type: 'image/jpeg',
          name: `${user.id}.jpg`,
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } as any);

        api.patchForm('users/avatar', data).then(apiResponse => {
          updateUser(apiResponse.data);
        });
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [updateUser, user.id],
  );

  const handleUpdateProfile = useCallback(
    async (data: ProfileFormData) => {
      try {
        formRef.current?.setErrors({});

        const schema = Yup.object().shape({
          name: Yup.string().required('Nome obrigatório'),
          email: Yup.string()
            .email('Digite um e-mail válido')
            .required('E-mail obrigatório'),
          old_password: Yup.string(),
          password: Yup.string().when(
            'old_password',
            ([old_password], innerSchema) =>
              old_password
                ? innerSchema.required('Campo obrigatório')
                : innerSchema.notRequired(),
          ),
          password_confirmation: Yup.string()
            .when('old_password', ([old_password], innerSchema) =>
              old_password
                ? innerSchema.required('Campo obrigatório')
                : innerSchema.notRequired(),
            )
            .oneOf([Yup.ref('password')], 'Confirmação incorreta'),
        });

        await schema.validate(data, {
          abortEarly: false,
        });

        const { name, email, old_password, password, password_confirmation } =
          data;

        const formData = {
          name,
          email,
          ...(old_password
            ? { old_password, password, password_confirmation }
            : {}),
        };

        const response = await api.put('/profile', formData);

        updateUser(response.data);

        Alert.alert('Perfil atualizado com sucesso');

        navigation.goBack();
      } catch (err) {
        if (err instanceof Yup.ValidationError) {
          const errors = getValidationErrors(err);

          formRef.current?.setErrors(errors);

          return;
        }

        Alert.alert(
          'Erro na atualização do perfil',
          'Ocorreu um erro ao atualizar seu perfil, tente novamente',
        );
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [navigation],
  );

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      enabled
    >
      <ScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{ flex: 1 }}
      >
        <Container>
          <HeaderContainer>
            <TouchableOpacity onPress={navigation.goBack}>
              <Icon name="chevron-left" size={24} color="#999591" />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() =>
                Alert.alert('Sair', 'Você deseja realmente sair do GoBarber?', [
                  {
                    text: 'Sim',
                    onPress: () => signOut(),
                  },
                  {
                    text: 'Não',
                  },
                ])
              }
            >
              <Icon name="power" size={24} color="#999591" />
            </TouchableOpacity>
          </HeaderContainer>

          <UserAvatarButton onPress={() => handleUpdateAvatar()}>
            <Avatar
              size={186}
              source={user.avatar_url}
              style={{ alignSelf: 'center' }}
            />
          </UserAvatarButton>

          <View>
            <Title>Meu Perfil</Title>
          </View>

          <Form initialData={user} ref={formRef} onSubmit={handleUpdateProfile}>
            <Input
              autoCapitalize="words"
              name="name"
              icon="user"
              placeholder="Nome"
              returnKeyType="next"
              onSubmitEditing={() => {
                emailInputRef.current?.focus();
              }}
            />
            <Input
              ref={emailInputRef}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              name="email"
              icon="mail"
              placeholder="E-mail"
              returnKeyType="next"
              onSubmitEditing={() => {
                oldPasswordInputRef.current?.focus();
              }}
            />
            <Input
              ref={oldPasswordInputRef}
              secureTextEntry
              name="old_password"
              icon="lock"
              placeholder="Senha atual"
              textContentType="newPassword"
              returnKeyType="next"
              containerStyle={{ marginTop: 16 }}
              onSubmitEditing={() => {
                passwordInputRef.current?.focus();
              }}
            />
            <Input
              ref={passwordInputRef}
              secureTextEntry
              name="password"
              icon="lock"
              placeholder="Nova senha"
              textContentType="newPassword"
              returnKeyType="next"
              onSubmitEditing={() => {
                confirmPasswordInputRef.current?.focus();
              }}
            />
            <Input
              ref={confirmPasswordInputRef}
              secureTextEntry
              name="password"
              icon="lock"
              placeholder="Confirmação de senha"
              textContentType="newPassword"
              returnKeyType="send"
              onSubmitEditing={() => formRef.current?.submitForm()}
            />
          </Form>

          <Button onPress={() => formRef.current?.submitForm()}>
            Confirmar mudanças
          </Button>
        </Container>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

export default Profile;
