// Define a getResponse function exported by the module
exports.getResponse = async (chatObject) => {
    // Set up an initial response array; this can also handle multiple responses to one message
    let response = [];

    //
    // BEGIN CHATBOT IMPLEMENTATION
    // Modify the following depending on your desired chatbot implementation
    //

    // Simplest chatbot: A series of conditions with predefined responses

    if (!chatObject.sender || chatObject.sender === '') {
        response = ['Hello!', 'What is your name?'];
        return response
    }

    if (!chatObject.message || chatObject.message === '') {
        response = ['What did you want to ask?']
        return response
    }

    if (chatObject.message.toLowerCase().includes('hello') || chatObject.message.toLowerCase().includes('hi')) {
        response.push('Hello, ' + chatObject.sender + '!')
    }

    if (chatObject.message.includes('?')) {
        response.push('We will be right with you to answer your question.');
    } else {
        response.push('Did you have a question for us today?')
    }

    //
    // END CHATBOT IMPLEMENTATION
    //

    // Return the response array for the chat server to use
    return response;
}