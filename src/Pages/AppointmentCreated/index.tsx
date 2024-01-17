import { useNavigation, useRoute } from '@react-navigation/native';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale/pt-BR';
import React, { useCallback, useMemo } from 'react';
import Icon from 'react-native-vector-icons/Feather';

import { AppointmentCreatedNavProps } from '../../@dtos/routes';
import {
  Container,
  Description,
  OkButton,
  OkButtonText,
  Title,
} from './styles';

function AppointmentCreated() {
  const { reset } = useNavigation<AppointmentCreatedNavProps['navigation']>();
  const { params } = useRoute<AppointmentCreatedNavProps['route']>();

  const routeParams = params;

  const handleOkPressed = useCallback(() => {
    reset({
      routes: [
        {
          name: 'Dashboard',
        },
      ],
      index: 0,
    });
  }, [reset]);

  const formattedDate = useMemo(
    () =>
      format(
        routeParams.date,
        "EEEE', dia 'dd' de 'MMMM' de 'yyyy' ás 'HH:mm'h'",
        { locale: ptBR },
      ),
    [routeParams.date],
  );

  return (
    <Container>
      <Icon name="check" size={80} color="#04d361" />

      <Title>Agendamento concluído!</Title>
      <Description>{formattedDate}</Description>

      <OkButton onPress={handleOkPressed}>
        <OkButtonText>Ok</OkButtonText>
      </OkButton>
    </Container>
  );
}

export default AppointmentCreated;
