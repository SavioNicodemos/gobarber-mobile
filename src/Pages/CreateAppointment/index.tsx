import DateTimePicker from '@react-native-community/datetimepicker';
import { useNavigation, useRoute } from '@react-navigation/native';
import { format } from 'date-fns';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Alert, FlatList, Platform } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';

import { useAuth } from '../../hooks/auth';
import api from '../../services/api';

import { CreateAppointmentNavProps } from '../../@dtos/routes';
import { Avatar } from '../../components/Avatar';
import {
  BackButton,
  Calendar,
  Container,
  Content,
  CreateAppointmentButton,
  CreateAppointmentButtonText,
  Header,
  HeaderTitle,
  Hour,
  HourText,
  OpenDatePickerButton,
  OpenDatePickerButtonText,
  ProviderContainer,
  ProviderName,
  ProvidersListContainer,
  Schedule,
  Section,
  SectionContent,
  SectionTitle,
  Title,
} from './styles';

export interface Provider {
  id: string;
  name: string;
  avatar_url: string;
}

interface AvailabilityItem {
  hour: number;
  available: boolean;
}

function CreateAppointment() {
  const route = useRoute<CreateAppointmentNavProps['route']>();
  const { user } = useAuth();
  const { goBack, navigate } =
    useNavigation<CreateAppointmentNavProps['navigation']>();
  const routeParams = route.params;

  const [availability, setAvailability] = useState<AvailabilityItem[]>([]);
  const [providers, setProviders] = useState<Provider[]>([]);
  const [selectedProvider, setSelectedProvider] = useState(
    routeParams.providerId,
  );
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedHour, setSelectedHour] = useState(0);

  const navigateBack = useCallback(() => {
    goBack();
  }, [goBack]);

  const morningAvailability = useMemo(
    () =>
      availability
        .filter(({ hour }) => hour < 12)
        .map(({ hour, available }) => ({
          hour,
          available,
          hourFormatted: format(new Date().setHours(hour), 'HH:00'),
        })),
    [availability],
  );

  const afternoonAvailability = useMemo(
    () =>
      availability
        .filter(({ hour }) => hour >= 12)
        .map(({ hour, available }) => ({
          hour,
          available,
          hourFormatted: format(new Date().setHours(hour), 'HH:00'),
        })),
    [availability],
  );

  const handleSelectProvider = useCallback((providerId: string) => {
    setSelectedProvider(providerId);
  }, []);

  const handleDateChange = useCallback((date: Date | undefined) => {
    if (Platform.OS === 'android') {
      setShowDatePicker(false);
    }

    if (date) {
      setSelectedDate(date);
    }
  }, []);

  const handleToggleDatePicker = useCallback(() => {
    setShowDatePicker(state => !state);
  }, []);

  const handleSelectHour = useCallback((hour: number) => {
    setSelectedHour(hour);
  }, []);

  const handleCreateAppointment = useCallback(async () => {
    try {
      const date = new Date(selectedDate);

      date.setHours(selectedHour);
      date.setMinutes(0);

      await api.post('appointments', {
        provider_id: selectedProvider,
        date,
      });

      navigate('AppointmentCreated', { date: date.getTime() });
    } catch (err) {
      Alert.alert(
        'Erro ao criar agendamento',
        'Ocorreu um erro ao tentar criar o agendamento, tente novamente!',
      );
    }
  }, [selectedProvider, selectedDate, selectedHour, navigate]);

  useEffect(() => {
    api.get('providers').then(response => {
      setProviders(response.data);
    });
  }, []);

  useEffect(() => {
    api
      .get(`providers/${selectedProvider}/day-availability`, {
        params: {
          year: selectedDate.getFullYear(),
          month: selectedDate.getMonth() + 1,
          day: selectedDate.getDate(),
        },
      })
      .then(response => {
        setAvailability(response.data);
      });
  }, [selectedProvider, selectedDate]);

  return (
    <Container>
      <Header>
        <BackButton onPress={navigateBack}>
          <Icon name="chevron-left" size={24} color="#999591" />
        </BackButton>

        <HeaderTitle>Cabeleireiros</HeaderTitle>

        <Avatar
          size={56}
          source={user.avatar_url}
          style={{ marginLeft: 'auto' }}
        />
      </Header>

      <Content>
        <ProvidersListContainer>
          <FlatList
            contentContainerStyle={{
              paddingTop: 32,
              paddingBottom: 32,
              paddingHorizontal: 24,
            }}
            horizontal
            showsHorizontalScrollIndicator={false}
            data={providers}
            keyExtractor={provider => provider.id}
            renderItem={({ item: provider }) => (
              <ProviderContainer
                selected={provider.id === selectedProvider}
                onPress={() => handleSelectProvider(provider.id)}
              >
                <Avatar size={32} source={provider.avatar_url} />
                <ProviderName selected={provider.id === selectedProvider}>
                  {provider.name}
                </ProviderName>
              </ProviderContainer>
            )}
          />
        </ProvidersListContainer>

        <Calendar>
          <Title>Escolha a data</Title>

          <OpenDatePickerButton onPress={handleToggleDatePicker}>
            <OpenDatePickerButtonText>
              Selecionar outra data
            </OpenDatePickerButtonText>
          </OpenDatePickerButton>
          {showDatePicker && (
            <DateTimePicker
              {...(Platform.OS === 'ios' && { textColor: '#f4ede8' })} // < nessa linha
              mode="date"
              display={Platform.OS === 'android' ? 'calendar' : 'spinner'}
              onChange={(_, date) => handleDateChange(date)}
              value={selectedDate}
              is24Hour
            />
          )}
        </Calendar>

        <Schedule>
          <Title>Escolha o horário</Title>

          <Section>
            <SectionTitle>Manhã</SectionTitle>
            <SectionContent>
              {morningAvailability.map(({ hourFormatted, hour, available }) => (
                <Hour
                  enabled={available}
                  selected={selectedHour === hour}
                  available={available}
                  key={hourFormatted}
                  onPress={() => handleSelectHour(hour)}
                >
                  <HourText selected={selectedHour === hour}>
                    {hourFormatted}
                  </HourText>
                </Hour>
              ))}
            </SectionContent>
          </Section>

          <Section>
            <SectionTitle>Tarde</SectionTitle>
            <SectionContent>
              {afternoonAvailability.map(
                ({ hourFormatted, hour, available }) => (
                  <Hour
                    enabled={available}
                    selected={selectedHour === hour}
                    available={available}
                    key={hourFormatted}
                    onPress={() => handleSelectHour(hour)}
                  >
                    <HourText selected={selectedHour === hour}>
                      {hourFormatted}
                    </HourText>
                  </Hour>
                ),
              )}
            </SectionContent>
          </Section>
        </Schedule>

        <CreateAppointmentButton onPress={handleCreateAppointment}>
          <CreateAppointmentButtonText>Agendar</CreateAppointmentButtonText>
        </CreateAppointmentButton>
      </Content>
    </Container>
  );
}

export default CreateAppointment;
