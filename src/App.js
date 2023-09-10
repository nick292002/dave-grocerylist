import Content from './Content';
import Header from './Header';
import AddItems from './AddItems';
import Footer from './Footer';
import Searchitem from './Searchitem';
import { useEffect, useState } from 'react';
import { apiRequest } from './apiRequest';

function App() {

  //note
  // start json Server npx json-server -p 3500 -w data/db.json

  const API_URL = 'http://localhost:3500/items';

  const [items, setItems] = useState([]);
  const [newItem, setNewItem] = useState('');
  const [search, setSearch] = useState('');
  const [fetchError, setFetchError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await fetch(API_URL);
        if (!response.ok) throw Error("Data not received");
        const listItems = await response.json();
        setItems(listItems);
        setFetchError(null);
      }
      catch (err) {
        setFetchError(err.message);
      }
      finally {
        setIsLoading(false);
      }
    }
    setTimeout(() => {
      fetchItems();
    }, 2000)
  }, []);

  const addItem = async (item) => {
    const id = items.length ? items[items.length - 1].id + 1 : 1;
    const myNewItem = { id, checked: false, item };
    const listItems = [...items, myNewItem];
    setItems(listItems);

    const postOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(myNewItem)
    }

    const result = await apiRequest(API_URL, postOptions);
    if (result) setFetchError(result);
  }

  const handleCheck = async (id) => {
    const listItems = items.map((item) => item.id === id ? { ...item, checked: !item.checked } : item);
    setItems(listItems);

    const myItem = listItems.filter((item) => item.id === id);

    const updateOptions = {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ checked: myItem[0].checked })
    };
    const reqUrl = API_URL + '/' + id;
    const result = await apiRequest(reqUrl, updateOptions);
    if (result) setFetchError(result);

  }

  const handleDelete = async (id) => {
    const listItems = items.filter((item) => item.id !== id);
    setItems(listItems);

    const DeleteOptions = {
      method: 'DELETE',
    };
    const requestUrl = API_URL + '/' + id;
    const result = await apiRequest(requestUrl, DeleteOptions);
    if (result) setFetchError(result);

  }

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!newItem) return;
    addItem(newItem);
    setNewItem('');
  }


  return (
    <div className="App">
      <Header title="Grocery List" />

      <AddItems
        newItem={newItem}
        setNewItem={setNewItem}
        handleSubmit={handleSubmit}
      />

      <Searchitem
        search={search}
        setSearch={setSearch}
      />

      <main>
        {isLoading && <p>Loading Item...</p>}
        {fetchError && <p style={{ color: 'red' }} >{'Error: ' + fetchError}</p>}

        {!fetchError && !isLoading &&
          <Content
            items={items.filter(item =>
              ((item.item).toLowerCase()).includes(search.toLocaleLowerCase())
            )}
            handleCheck={handleCheck}
            handleDelete={handleDelete}
          />}
      </main>

      <Footer length={items.length} />
    </div>
  );
}

export default App;
