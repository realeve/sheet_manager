import { connect } from 'dva';
import ProdList from './components/ProdList';
function SearchPage({ cart }) {
  return (
    <div>
      <ProdList cart={cart} />
    </div>
  );
}

export default connect(({ search }) => ({
  ...search,
}))(SearchPage);
