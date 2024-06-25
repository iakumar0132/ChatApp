import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import Loader from './Loader';

interface IChatData {
  sender: string;
  message: string;
  time: string;
};

const ChatAppHome = () => {
  const [chatData, setChatData] = useState<IChatData[]>([]);
  const [newMessage, setNewMessage] = useState<string>('');
  const [page, setPage] = useState<number>(0);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchData = async (pageNum: number) => {
      try {
        setIsLoading(true);
        const response = await axios.get(`https://qa.corider.in/assignment/chat?page=${pageNum}`);
        console.log("RESPONSE: ", response.data);
        if (pageNum === 0) {
          setChatData(response.data.chats);
        } else {
          setChatData(prevChats => [...response.data.chats, ...prevChats]);
        }
      } catch (error) {
        alert(`Error fetching chat data: ${error}`);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData(page);
  }, [page]);

  const handleScroll = () => {
    if (chatContainerRef.current) {
      if (chatContainerRef.current.scrollTop === 0) {
        setPage(prevPage => prevPage + 1);
      }
    }
  };

  useEffect(() => {
    const chatContainer = chatContainerRef.current;
    if (chatContainer) {
      chatContainer.addEventListener('scroll', handleScroll);
      return () => {
        chatContainer.removeEventListener('scroll', handleScroll);
      };
    }
  }, []);

  const scrollToBottom = () => {
    if (chatContainerRef.current) {
        window.scrollTo(0, document.body.scrollHeight);
        chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [newMessage]);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (newMessage.trim() !== '') {
      const newChat: IChatData = {
        sender: 'me',
        message: newMessage,
        time: new Date().toISOString(),
      };
      setChatData([...chatData, newChat]);
      setNewMessage('');
    }
  };
  
  return (
    <div className="flex flex-col mx-auto w-full bg-stone-50 max-w-[480px] rounded-[32px]">

      <div className="flex flex-col sticky top-0 px-4 pt-5 pb-4 bg-white w-full border-b border-solid border-stone-200 text-neutral-900">
        <div className="flex gap-3 items-center text-2xl font-bold">
          <div className="flex-1 self-stretch">Group Name</div>
          <img
            loading="lazy"
            src="https://cdn.builder.io/api/v1/image/assets/TEMP/19499dd8d93534454a9fe1072a321d2995b15abd10050f9a584b9ed2a4d615ba?apiKey=ad0536c147a54b0ab52575a2dda9bd51&"
            className="shrink-0 self-stretch my-auto w-5 aspect-square"
            alt="icon"
          />
        </div>
        <div className="flex gap-3 mt-4 text-xl font-semibold">
          <div className="flex flex-1 gap-4">
            <img
              loading="lazy"
              srcSet="https://cdn.builder.io/api/v1/image/assets/TEMP/ba77c655c7867f2cdcfdf05b175b6c8595e39cd4e657a4e4ebbc8c2c64d9745f?apiKey=ad0536c147a54b0ab52575a2dda9bd51&width=100 100w, https://cdn.builder.io/api/v1/image/assets/TEMP/ba77c655c7867f2cdcfdf05b175b6c8595e39cd4e657a4e4ebbc8c2c64d9745f?apiKey=ad0536c147a54b0ab52575a2dda9bd51&width=200 200w, https://cdn.builder.io/api/v1/image/assets/TEMP/ba77c655c7867f2cdcfdf05b175b6c8595e39cd4e657a4e4ebbc8c2c64d9745f?apiKey=ad0536c147a54b0ab52575a2dda9bd51&width=400 400w, https://cdn.builder.io/api/v1/image/assets/TEMP/ba77c655c7867f2cdcfdf05b175b6c8595e39cd4e657a4e4ebbc8c2c64d9745f?apiKey=ad0536c147a54b0ab52575a2dda9bd51&width=800 800w, https://cdn.builder.io/api/v1/image/assets/TEMP/ba77c655c7867f2cdcfdf05b175b6c8595e39cd4e657a4e4ebbc8c2c64d9745f?apiKey=ad0536c147a54b0ab52575a2dda9bd51&width=1200 1200w, https://cdn.builder.io/api/v1/image/assets/TEMP/ba77c655c7867f2cdcfdf05b175b6c8595e39cd4e657a4e4ebbc8c2c64d9745f?apiKey=ad0536c147a54b0ab52575a2dda9bd51&width=1600 1600w, https://cdn.builder.io/api/v1/image/assets/TEMP/ba77c655c7867f2cdcfdf05b175b6c8595e39cd4e657a4e4ebbc8c2c64d9745f?apiKey=ad0536c147a54b0ab52575a2dda9bd51&width=2000 2000w, https://cdn.builder.io/api/v1/image/assets/TEMP/ba77c655c7867f2cdcfdf05b175b6c8595e39cd4e657a4e4ebbc8c2c64d9745f?apiKey=ad0536c147a54b0ab52575a2dda9bd51&"
              className="shrink-0 w-12 aspect-square"
              alt="location"
            />
            <div>
              <span className="text-base font-medium text-zinc-600">From</span>{" "}
              <span className="text-lg font-bold">IGI Airport</span>
              <span className="text-lg font-bold">, T3</span>
              <br />
              <span className="text-base font-medium text-zinc-600">To</span>{" "}
              <span className="text-lg font-bold">Sector 28</span>
            </div>
          </div>
          <img
            loading="lazy"
            src="https://cdn.builder.io/api/v1/image/assets/TEMP/16d59e03f69b3a48c18f2e18e045131389869b0b357dda2d1cd7c705069cccce?apiKey=ad0536c147a54b0ab52575a2dda9bd51&"
            className="shrink-0 my-auto w-6 aspect-square"
            alt="map"
          />
        </div>
      </div>

      <div ref={chatContainerRef} className="flex flex-col px-4 -mt-6 w-full overflow-y-auto" style={{ maxHeight: '80vh' }}>
        {isLoading ?
            <Loader /> 
            : 
            <div className='flex p-4 mt-4 justify-center'>
                Scroll up to see new chats...

            </div>
        }
        {chatData.map((chat, index) => (
          <div key={index} className={`flex gap-3 mt-3 text-sm ${chat.sender === 'me' ? 'ml-8' : ''}`}>
            {chat.sender !== 'me' && (
              <img
                loading="lazy"
                src="https://cdn.builder.io/api/v1/image/assets/TEMP/e95e0d38f30f45725c7954b71025331d04db0901e4c2f91229d79a524688478f?apiKey=ad0536c147a54b0ab52575a2dda9bd51&"
                className="shrink-0 w-12 aspect-square"
                alt="icon"
              />
            )}
            <div className={`flex ${chat.sender === 'me' ? 'flex-1 justify-center py-4 text-sm font-medium leading-5 text-white bg-gray-600 rounded-[25px] shadow-[0px_4px_16px_rgba(0,0,0,0.25)]' : 'flex flex-col flex-1 justify-center py-4 text-sm font-medium leading-5 bg-white rounded-[25px] shadow-[0px_4px_16px_rgba(0,0,0,0.25)]'}`}>
              <div className="px-4">{chat.message}</div>
            </div>
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="flex mt-4 z-1000 sticky bottom-0 bg-white border-t border-solid border-stone-200 p-4">
        <input 
            type="text" 
            value={newMessage} 
            onChange={(e) => setNewMessage(e.target.value)} 
            className="flex-1 p-2 border border-gray-300 rounded-l-lg focus:outline-none focus:border-gray-500"
            placeholder="Type your message here..."
        />
            <button 
                type="submit" 
                className="p-2 bg-blue-500 text-white rounded-r-lg hover:bg-blue-700 focus:outline-none focus:bg-blue-700"
            >
            Send
        </button>
      </form>
    </div>
  );
};

export default ChatAppHome;
