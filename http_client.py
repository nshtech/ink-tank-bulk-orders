from socket import *
import sys
from pathlib import Path
import os


servername = '127.0.0.1'
serverport = 80

clientSocket = socket(AF_INET, SOCK_STREAM)
#CREATING GET REQUEST
def build_get_request(url): 
    serverport=80
    if url[0:7] != "http://":
        print("Invalid URL. Please try again.")
        os._exit(1)
    split_url = url.split(':')
    if len(split_url) > 2: # then there is a specified port
        serverport = split_url[2].split('/')
        
        serverport = int(serverport[0])
    #resplitting url by '//' to get rid of http
    split_url = url.split('//')
    #splitting url by '/' to split HOST and get request pages
    split_url = split_url[1].split('/')
    if len(split_url) > 1:
        get_string = ''
        for i in range(1,len(split_url)):
            get_string = get_string + '/' + split_url[i]
    else: 
        get_string = '/'
    servername = split_url[0]
    servername = servername.split(':')[0]

    #print('get_string: ', get_string)
    #print('servername: ',servername)
    #print('serverport: ', serverport)
    get_request = 'GET '+ get_string + ' HTTP/1.0\r\nHOST: ' + servername + '\r\n\r\n'
    return [get_request, servername,serverport]


def recvall(clientSocket):
    data = b''
    chunks = []
    while True:
        frag = clientSocket.recv(1024)
        chunks.append(frag)
        if len(frag) <= 0: #either 0 or just the end of the datastream response
            break
    return b''.join(chunks)



def make_server_request(url, redirect_count): 
    clientSocket = socket(AF_INET, SOCK_STREAM)
    if redirect_count >= 10:
        sys.exit('Webpage redirected you too many times.')
        os._exit(1)
    get_request,servername,serverport = build_get_request(url)
    clientSocket.connect((servername, serverport))

    clientSocket.send(get_request.encode())
    
    #getting server response
    string_data = ''


    data = recvall(clientSocket)
    string_data = data.decode('utf-8', errors="ignore")
    #print('string_data: ',string_data)
    clientSocket.close()
    '''if 'Content-Length' in string_data:
        start_index = string_data.find('Content-Length: ') + 16
        content_length = ''
        end_index = string_data[start_index:].find('\r\n')
        content_length = string_data[start_index:(start_index+end_index)]
        print('content length pre int cast: ', content_length)
        content_length = int(content_length)'''
    status_code = string_data[(string_data.find('HTTP')+9):(string_data.find('HTTP')+12)]
    #print('status code in string_data: ',status_code)
    response_phrase_end = string_data.find('\r\n')
    response_phrase = string_data[(string_data.find('HTTP')+13):response_phrase_end]
    content_type_start = string_data.find('Content-Type')+14
    content_type_end = string_data[content_type_start:].find(';')
    content_type = string_data[content_type_start:(content_type_start+content_type_end)]
    #print('content-type in string_data: ', content_type)
    if ('301' in status_code or '302' in status_code):
        # call main
        start_index = string_data.find('Location: ')+10
        end_index = string_data[start_index:].find('\r\n')
        new_url = string_data[start_index:(start_index+end_index)]
        new_url = new_url.replace('\r\n','')
        redirect_count += 1
        

        redirect_string = 'Redirected to: ' + new_url +'\n'
        sys.stderr.write(redirect_string)
        make_server_request(new_url,redirect_count)

    elif '40' in status_code:
        if '404' in status_code:
            print(string_data)
            sys.exit('The requested URL was not found on this server.')
        elif '403' in status_code:
            print(string_data)
            sys.exit('Forbidden Request. Request cannot be fulfilled.')
        else:
            print(string_data)
            sys.exit('Bad request.')
    elif "text/html" not in content_type:
        sys.exit('No HTML file returned')
    else:
        html_body = string_data[string_data.find('\r\n\r\n')+4:]
        print(html_body)

#MAIN REQUEST TO SERVER
make_server_request(sys.argv[1],0)
