/*
* File Manager - A Firefox OS file manager app
* Copyright (C) 2013-2015 Jhon Klever
*
* This program is free software: you can redistribute it and/or modify
* it under the terms of the GNU General Public License as published by
* the Free Software Foundation, either version 3 of the License, or
* (at your option) any later version.
*
* This program is distributed in the hope that it will be useful,
* but WITHOUT ANY WARRANTY; without even the implied warranty of
* MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
* GNU General Public License for more details.
*
* https://github.com/elfoxero/file-manager/blob/master/LICENSE
*/

var MIME = [
  {
    'mime': 'image/*', // Only supported natively
    'pattern': '^image\/.+',
    'extensions': ['jpg', 'jpeg', 'png', 'gif', 'bmp'],
    'class': 'image'
  },
  {
    'mime': 'audio/*', // Only supported natively
    'pattern': '^audio\/.+',
    'extensions': ['mp1', 'mp2', 'mp3', 'm4a', 'ogg', 'oga', 'opus', 'spx', 'amr'],
    'class': 'audio'
  },
  {
    'mime': 'video/*', // Only supported natively
    'pattern': '^video\/.+',
    'extensions': ['mp4', 'mpg4', 'webm', '3gp', '3gpp', 'ogv'],
    'class': 'video'
  },
  {
    'mime': 'audio/x-wav',
    'pattern': '^audio\/.*wav$',
    'extensions': ['wav'],
    'class': 'audio'
  },
  {
    'mime': 'audio/x-flac',
    'pattern': '\/x\-flac$',
    'extensions': ['flac'],
    'class': 'audio'
  },
  {
    'mime': 'video/x-matroska',
    'pattern': '\-matroska$',
    'extensions': ['mkv'],
    'class': 'video'
  },
  {
    'mime': 'video/x-msvideo',
    'pattern': '\-msvideo$',
    'extensions': ['avi'],
    'class': 'video'
  },
  {
    'mime': 'video/x-m4v',
    'pattern': '\/x\-m4v$',
    'extensions': ['m4v'],
    'class': 'video'
  },
  {
    'mime': 'application/pdf',
    'pattern': '.+\/pdf$',
    'extensions': ['pdf'],
    'class': 'pdf'
  },
  {
    'mime': 'application/zip',
    'pattern': '.+\/(x\-)?zip',
    'extensions': ['zip'],
    'class': 'zip'
  },
  {
    'mime': 'application/epub+zip',
    'pattern': '\/epub\+',
    'extensions': ['epub'],
    'class': 'ebook'
  },
  {
    'mime': 'application/x-tar',
    'pattern': '.+\/(x\-)?tar',
    'extensions': ['tar'],
    'class': 'zip'
  },
  {
    'mime': 'application/x-bzip',
    'pattern': '.+\/(x\-)?gz',
    'extensions': ['bz2', 'tbz2', 'tb2'],
    'class': 'zip'
  },
  {
    'mime': 'application/x-xz',
    'pattern': '.+\/(x\-)?xz',
    'extensions': ['xz'],
    'class': 'zip'
  },
  {
    'mime': 'application/x-gzip',
    'pattern': '.+\/(x\-)?gzip',
    'extensions': ['gz', 'tgz'],
    'class': 'zip'
  },
  {
    'mime': 'application/x-7z-compressed',
    'pattern': '.+\/(x\-)?7z',
    'extensions': ['7z'],
    'class': 'zip'
  },
  {
    'mime': 'application/x-rar-compressed',
    'pattern': '.+\/(x\-)?rar\-',
    'extensions': ['rar'],
    'class': 'zip'
  },
  {
    'mime': 'application/x-web-app-manifest+json',
    'pattern': '^application+\/.*app.manifest.*$',
    'extensions': ['webapp'],
    'class': 'developer'
  },
  {
    'mime': 'text/plain',
    'pattern': '^text\/plain$',
    'extensions': ['txt', 'text', 'log', 'ini'],
    'class': 'text'
  },
  {
    'mime': 'text/html',
    'pattern': '^text\/html$',
    'extensions': ['htm', 'html', 'xhtml'],
    'class': 'html'
  },
  {
    'mime': 'text/javascript',
    'pattern': 'javascript$',
    'extensions': ['js', 'json'],
    'class': 'developer'
  },
  {
    'mime': 'text/x-python',
    'pattern': 'python$',
    'extensions': ['py'],
    'class': 'developer'
  },
  {
    'mime': 'text/x-sh',
    'pattern': 'sh$',
     'extensions': ['sh', 'bash', 'bashrc'],
    'class': 'developer'
  },
  {
    'mime': 'text/x-java-source',
    'pattern': '.+\/(x\-)?java(\-)?',
     'extensions': ['java'],
    'class': 'developer'
  },
  {
    'mime': 'text/x-csrc',
    'pattern': '^text\/x\-csrc$',
     'extensions': ['c'],
    'class': 'developer'
  },
  {
    'mime': 'text/x-c++src',
    'pattern': '^text\/x\-c.*src$',
    'extensions': ['cc', 'cpp', 'c++'],
    'class': 'developer'
  },
  {
    'mime': 'text/x-php',
    'pattern': '\-php$',
    'extensions': ['php', 'php3', 'php4', 'php5', 'phps', 'pht', 'phtm', 'phtml'],
    'class': 'developer'
  },
  {
    'mime': 'text/x-ruby',
    'pattern': '\-ruby$',
    'extensions': ['rb', 'ruby'],
    'class': 'developer'
  },
  {
    'mime': 'text/css',
    'pattern': '^text\/css$',
    'extensions': ['css'],
    'class': 'css'
  },
  {
    'mime': 'text/csv',
    'pattern': '^text\/csv$',
    'extensions': ['csv'],
    'class': 'excel'
  },
  {
    'mime': 'text/rtf',
    'pattern': '^text/rtf$',
    'extensions': ['rtf'],
    'class': 'word'
  },
  {
    'mime': 'text/x-opml',
    'pattern': '^text\/x\-opml$',
    'extensions': ['opml'],
    'class': 'rss'
  },
  {
    'mime': 'application/rss+xml',
    'pattern': '^application\/rss\+xml$',
    'extensions': ['rss'],
    'class': 'rss'
  },
  {
    'mime': 'application/atom+xml',
    'pattern': '^application\/atom\+xml$',
    'extensions': ['atom'],
    'class': 'rss'
  },
  {
    'mime': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'pattern': '.*officedocument\.wordprocessingml.*',
    'extensions': ['doc', 'docx'],
    'class': 'word'
  },
  {
    'mime': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'pattern': '.*officedocument\.spreadsheetml.*',
    'extensions': ['xls', 'xlsx'],
    'class': 'excel'
  },
  {
    'mime': 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    'pattern': '.*officedocument\.presentationml.*',
    'extensions': ['ppt', 'pptx'],
    'class': 'powerpoint'
  },
  {
    'mime': 'application/vnd.oasis.opendocument.text',
    'pattern': '.*opendocument\.text.*',
    'extensions': ['odt'],
    'class': 'word'
  },
  {
    'mime': 'application/vnd.oasis.opendocument.spreadsheet',
    'pattern': '.*opendocument\.spreadsheet.*',
    'extensions': ['ods'],
    'class': 'excel'
  },
  {
    'mime': 'application/vnd.oasis.opendocument.presentation',
    'pattern': '.*opendocument\.presentation.*',
    'extensions': ['odp'],
    'class': 'powerpoint'
  },
];
