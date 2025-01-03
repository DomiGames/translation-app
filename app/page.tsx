'use client'
import { useState, useEffect } from 'react';

export default function Home() {
  const [inputText, setInputText] = useState('');
  const [translatedText, setTranslatedText] = useState('');
  const [sourceLang, setSourceLang] = useState('en');
  const [targetLang, setTargetLang] = useState('es');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    console.log('Translated Text Updated:', translatedText);
  }, [translatedText]);

  const handleTranslate = async () => {
    if (!inputText.trim()) {
      alert('Please enter text to translate.');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('/api/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: inputText, sourceLang, targetLang }),
      });

      const data = await response.json();
      console.log('Translation Response:', data);

      if (response.ok) {
        setTranslatedText(data.translatedText);
      } else {
        console.error('Translation error:', data.error);
        alert('Translation failed. Please try again.');
      }
    } catch (error) {
      console.error('Translation error:', error);
      alert('Translation failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleTextToSpeech = () => {
    if (!translatedText) {
      alert('No translated text to convert to speech.');
      return;
    }

    const utterance = new SpeechSynthesisUtterance(translatedText);
    utterance.lang = targetLang;
    speechSynthesis.speak(utterance);
  };

  const handleSpeechToText = () => {
    const recognition = new (window as any).webkitSpeechRecognition();
    recognition.lang = sourceLang;
    recognition.onresult = (event: any) => {
      setInputText(event.results[0][0].transcript);
    };
    recognition.start();
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-3xl font-bold mb-8">Language Translator</h1>
      <div className="grid grid-cols-2 gap-8">
        <div>
          <textarea
            className="w-full p-2 border rounded"
            rows={5}
            placeholder="Enter text to translate"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
          />
          <button
            className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            onClick={handleSpeechToText}
          >
            🎤 Speech to Text
          </button>
        </div>
        <div>
          <textarea
            className="w-full p-2 border rounded"
            rows={5}
            placeholder="Translated text"
            value={translatedText}
            readOnly
          />
          <button
            className="mt-4 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
            onClick={handleTextToSpeech}
          >
            🔊 Text to Speech
          </button>
        </div>
      </div>
      <div className="mt-8">
        <label className="mr-4">
          Source Language:
          <select
            className="ml-2 p-2 border rounded"
            value={sourceLang}
            onChange={(e) => setSourceLang(e.target.value)}
          >
            <option value="en">English</option>
            <option value="ja">Japanese</option>
            <option value="es">Spanish</option>
            <option value="fr">French</option>
            <option value="de">German</option>
            <option value="it">Italian</option>
          </select>
        </label>
        <label>
          Target Language:
          <select
            className="ml-2 p-2 border rounded"
            value={targetLang}
            onChange={(e) => setTargetLang(e.target.value)}
          >
            <option value="ja">Japanese</option>
            <option value="es">Spanish</option>
            <option value="en">English</option>
            <option value="fr">French</option>
            <option value="de">German</option>
            <option value="it">Italian</option>
          </select>
        </label>
        <button
          className="ml-4 bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600"
          onClick={handleTranslate}
          disabled={isLoading}
        >
          {isLoading ? 'Translating...' : 'Translate'}
        </button>
      </div>
    </div>
  );
}