import React, { useState, useEffect } from 'react';
import { Container, Form, Button, ListGroup, ListGroupItem, Dropdown, DropdownButton } from 'react-bootstrap';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import './Home.css';
import missingCover from '../images/missing book cover.png'; // Import the missing cover image

const Home = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [books, setBooks] = useState([]);
  const { query } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (query) {
      setSearchTerm(query);
      fetchBooks(query);
    }
  }, [query]);

  const handleSearch = async (e) => {
    e.preventDefault();
    navigate(`/search/${searchTerm}`);
  };

  const fetchBooks = async (term) => {
    try {
      const res = await axios.get(`https://www.googleapis.com/books/v1/volumes?q=${term}&maxResults=40&key=AIzaSyB7XTni6Gw4b1PCqp-qobu4YX83rDBKPM0`);
      setBooks(res.data.items || []);
    } catch (error) {
      console.error("Error fetching books:", error);
    }
  };

  const generateBuyLink = (title, site) => {
    const encodedTitle = encodeURIComponent(title);
    switch (site) {
      case 'amazon-us':
        return `https://www.amazon.com/s?k=${encodedTitle}`;
      case 'amazon-uk':
        return `https://www.amazon.co.uk/s?k=${encodedTitle}`;
      case 'bookshop-uk':
        return `https://uk.bookshop.org/search?keywords=${encodedTitle}`;
      case 'blackwells':
        return `https://blackwells.co.uk/bookshop/search/?keyword=${encodedTitle}`;
      default:
        return '#';
    }
  };

  return (
    <Container className="home-container text-center">
      <h1 className="welcome-text">QuillBorn</h1>
      <p className="subtitle">Bound by Quill, Unbound by Imagination</p>

      <Form onSubmit={handleSearch} className="search-bar">
        <Form.Group controlId="searchTerm">
          <Form.Control
            type="text"
            placeholder="Search for books..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </Form.Group>
        <Button variant="primary" type="submit" className="search-button">Search</Button>
      </Form>

      <ListGroup className="book-list">
        {books.length > 0 ? (
          books.map((book, index) => (
            <ListGroupItem key={index} className="book-item">
              <div className="book-item-content">
                <img 
                  src={book.volumeInfo?.imageLinks?.smallThumbnail || missingCover} 
                  alt={book.volumeInfo?.title} 
                  className="book-cover" 
                />
                <div className="book-info">
                  <h5 className="book-title">{book.volumeInfo?.title}</h5>
                  <p><strong>Author:</strong> {book.volumeInfo?.authors?.join(", ") || 'Unknown'}</p>
                  <p><strong>Page Count:</strong> {book.volumeInfo?.pageCount || 'N/A'}</p>
                  <p><strong>Release Date:</strong> {book.volumeInfo?.publishedDate || 'N/A'}</p>
                  <p><strong>Genre:</strong> {book.volumeInfo?.categories?.join(", ") || 'N/A'}</p>
                </div>
                <div className="book-actions">
                  <DropdownButton id={`dropdown-basic-button-${index}`} title="TBR" className="tbr-dropdown">
                    <Dropdown.Item href="#">TBR</Dropdown.Item>
                    <Dropdown.Item href="#">Reading</Dropdown.Item>
                    <Dropdown.Item href="#">DNF</Dropdown.Item>
                  </DropdownButton>
                  <DropdownButton id={`buy-dropdown-${index}`} title="Buy" className="btn-danger buy-dropdown">
                    <Dropdown.Item href={generateBuyLink(book.volumeInfo?.title, 'amazon-us')} target="_blank" rel="noopener noreferrer">Amazon US</Dropdown.Item>
                    <Dropdown.Item href={generateBuyLink(book.volumeInfo?.title, 'amazon-uk')} target="_blank" rel="noopener noreferrer">Amazon UK</Dropdown.Item>
                    <Dropdown.Item href={generateBuyLink(book.volumeInfo?.title, 'bookshop-uk')} target="_blank" rel="noopener noreferrer">Bookshop UK</Dropdown.Item>
                    <Dropdown.Item href={generateBuyLink(book.volumeInfo?.title, 'blackwells')} target="_blank" rel="noopener noreferrer">Blackwell's UK</Dropdown.Item>
                  </DropdownButton>
                </div>
              </div>
            </ListGroupItem>
          ))
        ) : (
          <p>Try searching for something!</p>
        )}
      </ListGroup>
    </Container>
  );
};

export default Home;
