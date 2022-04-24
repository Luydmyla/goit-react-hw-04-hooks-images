// import { Component } from 'react';
import { useState, useEffect } from 'react';
import pixabayAPI from '../services/pixabay-api';
import SearchBar from 'components/Searchbar';
import Loader from './Loader';
import ButtonLoadMore from './Button';
import PixabayImageGallery from './ImageGallery';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function App() {
  const [searchImage, setSearchImage] = useState('');
  const [error, setError] = useState(null);
  const [status, setStatus] = useState('idle');
  const [images, setImages] = useState([]);
  const [page, setPage] = useState(1);
  const per_page = 12;

  useEffect(() => {
    if (!searchImage) {
      return;
    }
    setStatus('pending');
    const loadImages = () => {
      pixabayAPI
        .fetchPixabayImage(searchImage, page, per_page)
        .then(responce => {
          if (responce.hits.length === 0) {
            toast.info(
              'Sorry, there are no images matching your search query. Please try again.'
            );
            setStatus('idle');
          } else {
            if (page * per_page > responce.total) {
              toast.info(
                'Sorry, there are no more images matching your search query.'
              );
              setImages(images => [...images, ...responce.hits]);
              setStatus('idle');
            } else {
              setImages(images => [...images, ...responce.hits]);
              setStatus('resolved');
            }
          }
          scrollToBottom();
        })
        .catch(error => {
          setError(error);
          setStatus('rejected');
        });
    };

    const loadImagesBySearch = () => {
      // setImages(images);
      loadImages();
    };
    loadImagesBySearch();
  }, [page, searchImage]);

  const handleFormSubmit = searchImage => {
    console.log(searchImage);
    resetPage();
    setSearchImage(searchImage);
    setImages([]);
  };

  const resetPage = () => {
    setPage(1);
  };

  const onButtonClick = () => {
    setPage(page + 1);
  };
  const scrollToBottom = () => {
    window.scrollTo({
      top: document.documentElement.scrollHeight,
      behavior: 'smooth',
    });
  };
  return (
    <div>
      <SearchBar inSubmit={handleFormSubmit} />
      <ToastContainer
        position={'top-center'}
        autoClose={4000}
        theme={'colored'}
      />
      {images.length !== 0 && <PixabayImageGallery images={images} />}
      {status === 'pending' && (
        <div>
          <Loader images={images} />
        </div>
      )}
      {status === 'rejected' && (
        <div role="alert">
          <p>{error.message}</p>
        </div>
      )}
      {status === 'resolved' && (
        <div>
          <ButtonLoadMore onClick={() => onButtonClick()} />
        </div>
      )}
    </div>
  );
}

// export default class App extends Component {
//   state = {
//     searchImage: '',
//     error: null,
//     // статус - ідле -ничего не делает, простой - стоит на месте
//     status: 'idle',
//     images: [],
//     page: 1,
//   };

//   componentDidUpdate(prevProps, prevState) {
//     const prevSearch = prevState.searchImage;
//     const nextSearch = this.state.searchImage;
//     const prevPage = prevState.page;
//     const nextPage = this.state.page;

//     if (prevSearch !== nextSearch) {
//       // console.log('змінився запрос');
//       this.loadImagesBySearch(nextSearch);
//       // this.setState({ searchImage: '' });
//       // this.resetImages();
//       // this.resetPage();
//     }

//     if (prevPage < nextPage) {
//       // console.log('змінився номер сторінки');
//       this.loadMoreImages(nextPage);
//     }
//     this.scrollToBottom();
//   }

//   handleFormSubmit = searchImage => {
//     console.log(searchImage);
//     this.resetPage();
//     this.setState({ searchImage: searchImage });
//   };
//   // функція для опрацювання запиту за введеним значенням
//   loadImagesBySearch(searchImage) {
//     this.setState({ status: 'pending', images: [] });
//     const { page } = this.state;
//     pixabayAPI
//       .fetchPixabayImage(searchImage, page)
//       .then(imagesObj => {
//         // console.log(images);
//         if (imagesObj.hits.length === 0) {
//           toast.error(
//             'Sorry, there are no images matching your search query. Please try again.'
//           );
//           this.setState({ status: 'idle' });
//         } else this.setState({ images: imagesObj.hits, status: 'resolved' });
//       })
//       .catch(error => this.setState({ error, status: 'rejected' }));
//     //  в кінці запиту змінюємо лоадінг на фолс, щоб не видно було
//     // .finally(() => this.setState({ loading: false }));
//   }
//   // функція для опрацювання запиту при натисненні кнопки -показати більше
//   // Load more images by current search query
//   loadMoreImages(page) {
//     this.setState({ status: 'pending' });
//     const { images, searchImage } = this.state;
//     pixabayAPI
//       .fetchPixabayImage(searchImage, page)
//       // якщо все добре, то ми міняємо статус на резолвд
//       .then(imagesObj => {
//         // console.log(response);
//         if (imagesObj.hits.length === 0) {
//           toast.error(
//             'Sorry, there are no more images matching your search query.'
//           );
//           this.setState({ status: 'idle' });
//         } else
//           this.setState({
//             images: [...images, ...imagesObj.hits],
//             status: 'resolved',
//           });
//       })
//       // якщо з помилкою, то ми міняємо статус на реджектед
//       .catch(error => this.setState({ error, status: 'rejected' }));
//   }
//   resetImages() {
//     this.setState({ images: [] });
//   }
//   resetPage() {
//     // console.log(this.state.page);
//     this.setState({ page: 1 });
//   }

//   onButtonClick() {
//     // console.log('Видно кнопку');
//     this.setState(prevState => ({
//       page: prevState.page + 1,
//     }));
//   }
//   scrollToBottom() {
//     // const { height: cardHeight } = document
//     //   .querySelector('.ImageGallery')
//     //   .firstElementChild.getBoundingClientRect();
//     // window.scrollBy({
//     //   // top: cardHeight * 40,
//     //   top: cardHeight * 1,
//     //   behavior: 'smooth',
//     // });

//     window.scrollTo({
//       top: document.documentElement.scrollHeight,
//       behavior: 'smooth',
//     });
//   }
//   render() {
//     const { images, status, error } = this.state;
//     return (
//       <div>
//         <SearchBar inSubmit={this.handleFormSubmit} />
//         <ToastContainer autoClose={4000} />
//         {images.length !== 0 && <PixabayImageGallery images={images} />}
//         {status === 'pending' && (
//           <div>
//             <Loader images={images} />
//           </div>
//         )}
//         {status === 'rejected' && (
//           <div role="alert">
//             <p>{error.message}</p>
//           </div>
//         )}
//         {status === 'resolved' && (
//           <div>
//             <ButtonLoadMore onClick={() => this.onButtonClick()} />
//           </div>
//         )}
//       </div>
//     );
//   }
// }
