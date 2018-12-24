# docker-componse 自定义 IP

```yaml
version: '3'

services:
  demo1:
    image: xuexb/docker-centos7-ifconfig
    container_name: demo1
    environment:
      ENV_LABEL: 'demo1'
    tty: true
    networks:
      inner:
        ipv4_address: 192.168.3.101
    extra_hosts:
      - 'demo1:192.168.3.101'
      - 'demo2:192.168.3.102'
      - 'demo3:192.168.3.103'

  demo2:
    image: xuexb/docker-centos7-ifconfig
    container_name: demo2
    environment:
      ENV_LABEL: 'demo2'
    tty: true
    networks:
      inner:
        ipv4_address: 192.168.3.102
    extra_hosts:
      - 'demo1:192.168.3.101'
      - 'demo2:192.168.3.102'
      - 'demo3:192.168.3.103'
  
  demo3:
    image: xuexb/docker-centos7-ifconfig
    container_name: demo3
    environment:
      ENV_LABEL: 'demo3'
    tty: true
    networks:
      inner:
        ipv4_address: 192.168.3.103
    extra_hosts:
      - 'demo1:192.168.3.101'
      - 'demo2:192.168.3.102'
      - 'demo3:192.168.3.103'

networks:
  inner:
    ipam:
      driver: default
      config:
      - subnet: 192.168.3.1/24
```