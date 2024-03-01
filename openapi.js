const apiKey = process.env.OPENAI_API_KEY;
// const apiKey = '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';
        // OpenAI API 엔드포인트
const apiUrl = 'https://api.openai.com/v1/chat/completions';

let songObject = {
    title: "",
    singer: ""
};

const inputButton = document.getElementById("input-button")
inputButton.addEventListener('click', () => generateResponse())

async function generateResponse() {
    const userInput = document.getElementById('userInput').value;

    const messages = [
        { role: 'system', content: 'You are a machine that recommends songs without saying much.When you enter a keyword, 10 titles and singers should be displayed.' },
        { role: 'user', content: userInput },
        { role: 'assistant', content: 'Just answer in the format “title by singer”'},
      ];
      
      const requestData = {
        model: 'gpt-3.5-turbo', // 모델 선택
        messages: messages,
      };

    try {
        
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`,
            },
            body: JSON.stringify(requestData),
        });

        const result = await response.json();
        console.log(result)
        console.log(result.choices[0].message.content)

        // const [num, recommendText] = result.choices[0].message.content.split('.');
        // const [title, singer] = recommendText.split('by');

        const songsArray = result.choices[0].message.content.split('\n');

        // 분할된 배열을 순회하며 각 노래의 제목과 가수를 추출하여 새로운 배열에 저장
        var songs = [];
        for (var i = 0; i < songsArray.length; i++) {
            // 앞의 숫자 제거
            const data = songsArray[i].replace(/^\d+\.\s/, '');
            // 노래의 제목과 가수를 공백 기준으로 분할
            const songInfo = data.split(' by ');

            songObject = {
                title: songInfo[0],
                singer: songInfo[1]
            };
        
            songs.push(songObject);
        }

        for(let i = 0; i < 10; i++)
        {
            console.log("Title:", songs[i].title);
            console.log("Singer:", songs[i].singer);
        }

        // console.log(title, singer)

        document.getElementById('output').innerText = result.choices[0].message.content;
    } catch (error) {
        console.error('Error:', error);
        document.getElementById('output').innerText = 'Error fetching response from OpenAI.';
    }
}