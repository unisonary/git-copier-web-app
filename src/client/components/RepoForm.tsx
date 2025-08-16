import React, { useState } from 'react';

const RepoForm: React.FC = () => {
    const [sourceUrl, setSourceUrl] = useState('');
    const [newUrl, setNewUrl] = useState('');
    const [author, setAuthor] = useState('');
    const [email, setEmail] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Handle form submission logic here
        console.log('Form submitted:', { sourceUrl, newUrl, author, email });
    };

    return (
        <form onSubmit={handleSubmit}>
            <div>
                <label htmlFor="sourceUrl">Source Repository URL:</label>
                <input
                    type="text"
                    id="sourceUrl"
                    value={sourceUrl}
                    onChange={(e) => setSourceUrl(e.target.value)}
                    required
                />
            </div>
            <div>
                <label htmlFor="newUrl">New Repository URL:</label>
                <input
                    type="text"
                    id="newUrl"
                    value={newUrl}
                    onChange={(e) => setNewUrl(e.target.value)}
                    required
                />
            </div>
            <div>
                <label htmlFor="author">Author Name:</label>
                <input
                    type="text"
                    id="author"
                    value={author}
                    onChange={(e) => setAuthor(e.target.value)}
                />
            </div>
            <div>
                <label htmlFor="email">Author Email:</label>
                <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
            </div>
            <button type="submit">Copy Repository</button>
        </form>
    );
};

export default RepoForm;