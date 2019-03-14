import { connect } from 'dva';
import ProdList from './components/ProdList';
function SearchPage({ cartnumber }) {
  return (
    <div>
      <ProdList cart={cartnumber} />
    </div>
  );
}

export default connect(({ search }) => ({
  ...search,
}))(SearchPage);
