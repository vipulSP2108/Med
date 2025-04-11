const TruncatedTextComponent = (text, maxLength) => {
    if(text){
        if (text && text?.length > maxLength) {
            return text.substring(0, maxLength) + '...';
        }
        return text;
    }
};

export default TruncatedTextComponent