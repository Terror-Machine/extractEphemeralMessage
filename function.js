function _extractQuoteMedia(m) {
	if (!m) return null;
	if (m.quoted) {
		if (m.quoted.ephemeralMessage?.message) {
			return m.quoted.ephemeralMessage.message;
		}
		if (m.quoted.message) {
			return m.quoted.message;
		}
		return m.quoted;
	}
}
function _extractMedia(m) {
	if (!m) return null;
	if (m.quoted) {
		if (m.quoted.ephemeralMessage?.message) {
			return m.quoted.ephemeralMessage.message;
		}
		if (m.quoted.message) {
			return m.quoted.message;
		}
		return m.quoted;
	} else {
		return m.message;
	}
};
function _gMime(msg) {
	return (
		msg?.imageMessage?.mimetype
		|| msg?.videoMessage?.mimetype
		|| msg?.stickerMessage?.mimetype
		|| msg?.audioMessage?.mimetype
		|| msg?.documentMessage?.mimetype
		|| msg?.voiceMessage?.mimetype
		|| msg?.pttMessage?.mimetype
		|| msg?.mimetype
		|| msg?.mime
	);
};
function _tImage(msg) {
	return 'imageMessage' in msg;
};
function _tVideo(msg) {
	return 'videoMessage' in msg;
};
function _tAudio(msg) {
	return 'audioMessage' in msg;
};
function _tSticker(msg) {
	return 'stickerMessage' in msg;
};
function _aImage(mime) {
	const _iMimes = [
		'image/jpeg',
		'image/jpg',
		'image/png',
		'image/webp',
		'image/gif'
	];
	return _iMimes.includes(mime);
};
function _aVideo(mime) {
	const _vMimes = [
		'video/mp4',
		'video/3gpp'
	];
	return _vMimes.includes(mime);
};
function _aAudio(mime) {
	const audioMimes = [
		'audio/ogg; codecs=opus',
		'audio/ogg',
		'audio/mpeg',
		'audio/mp4',
		'audio/aac',
		'audio/amr'
	];
	return audioMimes.includes(mime);
};
function _aSticker(mime) {
	const _sMimes = [
		'image/webp',
		'application/octet-stream'
	];
	return _sMimes.includes(mime);
};
function _aDocument(mime) {
	const _dMimes = [
		'application/pdf',
		'application/msword',
		'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
		'application/vnd.ms-excel',
		'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
		'application/zip',
		'application/x-rar-compressed'
	];
	return _dMimes.includes(mime);
};
function _aCsticker(mime) {
	return (
		_aSticker(mime) || _aImage(mime) || _aVideo(mime)
	);
};
function _tCsticker(msg) {
	return (
		_tSticker(msg) || _tImage(msg) || _tVideo(msg)
	);
};


if (getComs(txt, 'btes')) {
	const _m = _extractMedia(m);
	if (!_m) return reactFail();
	const mime = _gMime(_m);
	if (!mime || !_aCsticker(mime) || !_tCsticker(_m)) return reactFail();
	const duration = _m?.videoMessage?.seconds || 0;
	if ((mime === 'video/mp4' || mime === 'image/gif') && duration > 20) return reactFail();
	const buffer = await fn.getMediaBuffer(_m);
	if (!buffer) return reactFail();
	await sendRawWebpAsSticker(buffer);reactDone();limitAdd(serial);counthit(serial);
}
