import React, { useState, useEffect, useRef } from 'react';
import { Container, Form, Button, ListGroup, ListGroupItem, Dropdown, DropdownButton, DropdownMenu, DropdownItem } from 'react-bootstrap';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import './Home.css';
import missingCover from '../images/missing book cover.png'; // Import the missing cover image
import favicon from '../images/favicon64.png'; // Import the favicon image

const Home = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [books, setBooks] = useState([]);
  const [preview, setPreview] = useState([]);
  const { query } = useParams();
  const navigate = useNavigate();
  const searchInputRef = useRef(null);
  const previewRef = useRef(null);

  useEffect(() => {
    if (query) {
      setSearchTerm(query);
      fetchBooks(query);
    }
  }, [query]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchInputRef.current && !searchInputRef.current.contains(event.target) &&
          previewRef.current && !previewRef.current.contains(event.target)) {
        setPreview([]);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSearch = async (e) => {
    e.preventDefault();
    navigate(`/search/${searchTerm}`);
  };

  const fetchBooks = async (term) => {
    try {
      const res = await axios.get(`https://www.googleapis.com/books/v1/volumes?q=${term}&maxResults=40&key=AIzaSyB7XTni6Gw4b1PCqp-qobu4YX83rDBKPM0`);
      setBooks(res.data.items || []);
      setPreview(res.data.items.slice(0, 5) || []);
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
      <div className="header">
        <a href="/" className="header-link">
          <img src={favicon} alt="QuillBorn" className="header-icon" />
          <h1 className="welcome-text">QuillBorn</h1>
        </a>
        <p className="subtitle">Bound by Quill, Unbound by Imagination</p>
      </div>

      <Form onSubmit={handleSearch} className="search-bar">
        <Form.Group controlId="searchTerm" ref={searchInputRef}>
          <Form.Control
            type="text"
            placeholder="Search for books..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              fetchBooks(e.target.value);
            }}
            className="search-input"
          />
        </Form.Group>
        <Button variant="primary" type="submit" className="search-button">Search</Button>
        <div className="search-preview-container" ref={previewRef}>
          {preview.length > 0 && (
            <DropdownMenu className="search-preview-dropdown">
              {preview.map((book, index) => (
                <DropdownItem key={index} className="search-preview-item">
                  <img 
                    src={book.volumeInfo?.imageLinks?.smallThumbnail || missingCover} 
                    alt={book.volumeInfo?.title} 
                    className="preview-book-cover" 
                  />
                  <div className="preview-book-info">
                    <h5 className="preview-book-title">{book.volumeInfo?.title}</h5>
                    <p className="preview-book-author">{book.volumeInfo?.authors?.join(", ") || 'Unknown'}</p>
                  </div>
                </DropdownItem>
              ))}
              {preview.length > 0 && (
                <Dropdown.Item as="button" className="show-all-results" onClick={() => navigate(`/search/${searchTerm}`)}>
                  Show ALL Results...
                </Dropdown.Item>
              )}
            </DropdownMenu>
          )}
        </div>
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
