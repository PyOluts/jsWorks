window.addComment = (text, parentId = null) => {
    const newComment = {
        id: Date.now(),
        parentId: parentId,
        text: text,
        time: new Date().toLocaleString()
    };

    if (parentId === null) {
         
        comments.push(newComment);
    } else {
         
        const parentIndex = comments.findIndex(c => c.id === parentId); //  интератор , проверка
        comments.splice(parentIndex + 1, 0, newComment);
    }

    localStorage.setItem('my_blog_comments', JSON.stringify(comments));
    renderComments();
};

const parentIndex = comments.findIndex(c => c.id === parentId);
        comments.splice(parentIndex + 1, 0, newComment);

 