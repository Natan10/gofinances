import React, {useCallback, useState} from 'react';
import { ActivityIndicator } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import {useTheme} from 'styled-components';
import { useAuth } from '../../hooks/auth';

import HighlightCard from '../../components/HighlightCard';
import { TransactionCard, TransactionCardProps } from '../../components/TransactionCard';

import { 
  Container,
  Header,
  UserWrapper,
  UserInfo,
  Photo,
  User,
  UserGretting,
  UserName,
  Icon,
  HighlightCards,
  Transactions,
  Title,
  TransactionsList,
  LogoutButton,
  LoadContainer
} from './styles';

export interface DataListProps extends TransactionCardProps {
  id: string;
}

interface HighlightProps {
  amount: string;
  lastTransaction: string;
}

interface HighlightData {
  entries: HighlightProps;
  expensives: HighlightProps;
  total: HighlightProps;
}

export const Dashboard: React.FC = () => {
  const { user,signOut } = useAuth();
  
  const [isLoading, setIsLoading] = useState(true);
  const [transactions, setTransactions] = useState<DataListProps[]>([]);
  const [higthlightData, setHighlightData] = useState<HighlightData>({} as HighlightData);
  
  const theme = useTheme();

  function getLastTransactionDate(
    collection: DataListProps[], 
    type: 'positive' | 'negative'
  ){

    const collectionFilttered = collection
      .filter(transaction => transaction.type === type);

    if(collectionFilttered.length === 0) {
      return 0;
    }

    const lastTransaction = new Date(
      Math.max.apply(Math,
        collectionFilttered
        .map((transaction) => 
          new Date(transaction.date).getTime()
        )  
      )
    );

    const lastTransactionFormatted = new Date(lastTransaction)
    .toLocaleDateString('pt-BR', {day: '2-digit', month: 'long'});

    return lastTransactionFormatted;
  }
  
  async function loadTransactions(){
    const dataKey = `@gofinances:transactions_user:${user.id}`;
    let entriesTotal = 0;
    let expensiveTotal = 0;
    
    try{
      const response = await AsyncStorage.getItem(dataKey);
      const transactions = response ? JSON.parse(response) : [];

      const transactionsFormatted: DataListProps[] = transactions
        .map((item: DataListProps) => {
          if(item.type === 'positive'){
            entriesTotal += Number(item.amount);
          } else {
            expensiveTotal += Number(item.amount);
          }

          const amount = Number(item.amount).toLocaleString('pt-BR',{
            style: 'currency',
            currency: 'BRL'
          });

          const date = new Date(item.date).toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: '2-digit',
          });

          return {
            id: item.id,
            name: item.name,
            amount,
            type: item.type,
            category: item.category,
            date
          }

        });
         
      setTransactions(transactionsFormatted);

      const lastTransactionEntries = getLastTransactionDate(transactions, 'positive');
      const lastTransactionExpensives = getLastTransactionDate(transactions, 'negative');
      
      const totalInterval = lastTransactionExpensives === 0 ? 
      'Não há transações' : 
      `01 a ${lastTransactionExpensives}`;
        
      setHighlightData({
        entries: {
          amount: entriesTotal.toLocaleString('pt-BR',{
            style: 'currency',
            currency: 'BRL'
          }),
          lastTransaction: lastTransactionEntries === 0
            ? 'Não há transações' : 
            `Última entrada dia ${lastTransactionEntries}`
        },
        expensives: {
          amount: expensiveTotal.toLocaleString('pt-BR',{
            style: 'currency',
            currency: 'BRL'
          }),
          lastTransaction: lastTransactionExpensives === 0 
            ? 'Não há transações' : 
            `Última saída dia ${lastTransactionExpensives}`
        },
        total:{
          amount: (entriesTotal - expensiveTotal).toLocaleString('pt-BR',{
            style: 'currency',
            currency: 'BRL'
          }),
          lastTransaction: totalInterval
        } 
      });
  
      setIsLoading(false);
    }catch(err){
      console.log(err);
    }
  }

  // React.useEffect(()=>{
  //   AsyncStorage.removeItem('@gofinances:transactions');
  // })

  useFocusEffect(
    useCallback(() => {
      loadTransactions()
    },[])
  );

  return (
    <Container>
      { isLoading ?
        (
         <LoadContainer>
          <ActivityIndicator 
            color={theme.colors.primary}
            size="large"
          />
         </LoadContainer>
        ) : 
        (<>
          <Header>
            <UserWrapper>
              <UserInfo>
                <Photo 
                  source={
                    {uri: user.photo}
                  } 
                />
                <User>
                  <UserGretting>Olá,</UserGretting>
                  <UserName>{user.name}</UserName>
                </User>
              </UserInfo>

              <LogoutButton onPress={signOut}>
                <Icon name="power" />
              </LogoutButton>
            </UserWrapper>
          </Header>
          <HighlightCards>
            <HighlightCard 
              type='up'
              title='Entradas' 
              amount={higthlightData.entries.amount}
              lastTransaction={higthlightData.entries.lastTransaction} 
            />
            <HighlightCard 
              type='down'
              title='Saídas' 
              amount={higthlightData.expensives.amount}
              lastTransaction={higthlightData.entries.lastTransaction}
            />
            <HighlightCard 
              type='total'
              title='Total' 
              amount={higthlightData.total.amount}
              lastTransaction={higthlightData.total.lastTransaction}
            />
            
          </HighlightCards>

          <Transactions>
            <Title>Listagem</Title>

            <TransactionsList 
              data={transactions}
              keyExtractor={item => item.id}
              renderItem={({ item }) =>{ 
                return <TransactionCard data={item} />
              }}
            />
          </Transactions>
        </>)
      }
    </Container>
  );
}