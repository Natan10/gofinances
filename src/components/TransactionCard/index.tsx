import React from 'react';
import { categories } from '../../utils/categories';

import { 
  Container,
  Title,
  Amount,
  Footer,
  Category,
  Icon,
  CategoryName,
  Date,
} from './styles';


export interface TransactionCardProps {
  type: 'positive' | 'negative';
  name: string;
  amount: string;
  category: string;
  date: string;
}

interface Props {
  data: TransactionCardProps;
}

export const TransactionCard: React.FC<Props> = ({
  data
}) => {
  const {name, amount, category, date, type} = data;
  const [categoryInfo] = categories.filter(item => item.key === category); 


  return(
    <Container>
      <Title>{name}</Title>
      <Amount type={type}>
        {type ==='negative' && '- '}
        {amount}
      </Amount>

      <Footer>
        <Category>
          <Icon name={categoryInfo.icon} />
          <CategoryName>{categoryInfo.name}</CategoryName>
        </Category>
        <Date>{date}</Date>
      </Footer>
    </Container>
  );
}
