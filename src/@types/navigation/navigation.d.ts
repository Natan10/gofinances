import {GoFinancesRoutesList} from '../../routes/routes';


declare global {
  namespace ReactNavigation{
    interface RootParamList extends GoFinancesRoutesList {}
  }
}