	var SpeechRecognition = this.SpeechRecognition ||
                          this.webkitSpeechRecognition ||
                          this.mozSpeechRecognition ||
                          this.msSpeechRecognition ||
                          this.oSpeechRecognition;
	Yatay.recognition = {};
	Yatay.recognition.listen = new SpeechRecognition();
	Yatay.recognition.listen.continuous = true;
	Yatay.recognition.listen.maxAlternatives = 5;
	Yatay.recognition.listen.interimResults = true;
	Yatay.recognition.listen.lang = "es-UY";
	Yatay.recognition.final_transcript = "";
    Yatay.recognition.lastStartedAt = new Date().getTime();
	
	Yatay.recognition.talk = {};
	Yatay.recognition.talk.msg = new SpeechSynthesisUtterance();
	var voices = window.speechSynthesis.getVoices();
	Yatay.recognition.talk.msg.voice = voices[2]; // Note: some voices don't support altering params
	Yatay.recognition.talk.msg.voiceURI = 'native';
	Yatay.recognition.talk.msg.volume = 1; // 0 to 1
	Yatay.recognition.talk.msg.rate = 0.9; // 0.1 to 10
	Yatay.recognition.talk.msg.pitch = 2; //0 to 2
	Yatay.recognition.talk.msg.text = 'No entiendo que es ';
	Yatay.recognition.talk.msg.lang = 'es-UY';

	Yatay.recognition.listen.onerror = function(event) {
		if (event.error == 'no-speech') {
		  alert('no_speech');
		  Yatay.recognition.ignore_onend = true;
		}
		if (event.error == 'audio-capture') {
		  alert('no_microphone');   
		  Yatay.recognition.ignore_onend = true;	  
		}
		if (event.error == 'not-allowed') {
		  if (event.timeStamp - start_timestamp < 100) {
			alert('info_blocked');
		  } else {
			alert('info_denied');
		  }
		  Yatay.recognition.ignore_onend = true;
		}
		alert(event.error);
	};


	Yatay.recognition.listen.onresult = function(event) {
		for (var i = event.resultIndex; i < event.results.length; ++i) {
		  if (event.results[i].isFinal) {
			alert(Yatay.recognition.listen.continuous);
			Yatay.recognition.final_transcript += event.results[i][0].transcript;
			Yatay.recognition.talk.msg.text += Yatay.recognition.final_transcript;
			speechSynthesis.speak(Yatay.recognition.talk.msg);										
		  } 
		}      
	}

	Yatay.recognition.listen.onend = function(e) {
		alert(Yatay.recognition.listen.continuous);
		var timeSinceLastStart = new Date().getTime()-Yatay.recognition.lastStartedAt;
		if (timeSinceLastStart < 1000) {
			setTimeout(function() { 
				Yatay.recognition.lastStartedAt = new Date().getTime();
				Yatay.recognition.listen.start();
			}, 1000-timeSinceLastStart);
		} else {
			Yatay.recognition.lastStartedAt = new Date().getTime();
			Yatay.recognition.listen.start();
		}
		return;
	};
	Yatay.recognition.talk.msg.onend = function(e) {
		Yatay.recognition.talk.msg.text = 'No entiendo que es ';		
		Yatay.recognition.final_transcript = "";
	};