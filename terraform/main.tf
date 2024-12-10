provider "aws" {
  region = "us-east-1" 
}

resource "aws_vpc" "vpc" {
  cidr_block = "10.0.0.0/16"
  enable_dns_support   = true
  enable_dns_hostnames = true
  tags = {
    Name = "collaborativeCodeEditor"
  }
}

# Create public and private subnets
resource "aws_subnet" "DMZ" {
  vpc_id = aws_vpc.vpc.id
  cidr_block = "10.0.1.0/24"
  map_public_ip_on_launch = true
  availability_zone = "us-east-1a" 
  tags = {
    Name = "DMZ"
  }
}

resource "aws_subnet" "publicB" {
  vpc_id = aws_vpc.vpc.id
  cidr_block = "10.0.2.0/24"
  availability_zone = "us-east-1b"
  map_public_ip_on_launch = true

  tags = {
    Name = "PublicSubnetB"
  }
}

resource "aws_subnet" "frontend" {
  vpc_id = aws_vpc.vpc.id
  cidr_block = "10.0.3.0/24" 
  availability_zone = "us-east-1a"
  tags = {
    Name = "frontEnd"
  }
}

resource "aws_subnet" "backend" {
  vpc_id = aws_vpc.vpc.id
  cidr_block = "10.0.4.0/24" 
  availability_zone = "us-east-1a"
  tags = {
    Name = "backend"
  }
}

resource "aws_internet_gateway" "igw" {
  vpc_id = aws_vpc.vpc.id
  tags = {
    Name = "InternetGateway"
  }
}

resource "aws_route_table" "DMZ_RT" {
  vpc_id = aws_vpc.vpc.id
  route {
    cidr_block     = "0.0.0.0/0"
    gateway_id     = aws_internet_gateway.igw.id
  }
  tags = {
    Name = "DMZ_RT"
  }
}

resource "aws_route_table" "Frontend_RT" {
  vpc_id = aws_vpc.vpc.id
  route {
    cidr_block     = "0.0.0.0/0"
    nat_gateway_id = aws_nat_gateway.my_nat.id
  }
  tags = {
    Name = "Frontend_RT"
  }
}

resource "aws_route_table" "Backend_RT" {
  vpc_id = aws_vpc.vpc.id
  route {
    cidr_block     = "0.0.0.0/0"
    nat_gateway_id = aws_nat_gateway.my_nat.id
  }
  tags = {
    Name = "Backend_RT"
  }
}

resource "aws_eip" "nat_eip" {
  domain = "vpc"
  tags = {
    Name = "Elastic IP"
  }
}

resource "aws_nat_gateway" "my_nat" {
  allocation_id = aws_eip.nat_eip.id
  subnet_id     = aws_subnet.DMZ.id
  tags = {
    Name = "NatGateway"
  }
}

resource "aws_route_table_association" "DMZ_subnet_association" {
  subnet_id      = aws_subnet.DMZ.id
  route_table_id = aws_route_table.DMZ_RT.id
}

resource "aws_route_table_association" "Frontend_association" {
  subnet_id      = aws_subnet.frontend.id
  route_table_id = aws_route_table.Frontend_RT.id
}

resource "aws_route_table_association" "Backend_association" {
  subnet_id      = aws_subnet.backend.id
  route_table_id = aws_route_table.Backend_RT.id
}

# Security Groups
resource "aws_security_group" "ssh_bastion" {
  name        = "ssh-bastion-sg"
  description = "Security group for SSH Bastion instance"
  vpc_id      = aws_vpc.vpc.id
}

resource "aws_security_group" "app_lb" {
  name        = "appLB-sg"
  description = "Security group for Load Balancer"
  vpc_id      = aws_vpc.vpc.id
}

resource "aws_security_group" "frontend_app" {
  name        = "Frontend-sg"
  description = "Security group for frontend application"
  vpc_id      = aws_vpc.vpc.id
}

resource "aws_security_group" "backend_app" {
  name        = "Backend-sg"
  description = "Security group for backend application"
  vpc_id      = aws_vpc.vpc.id
}

resource "aws_security_group" "databases" {
  name        = "databases-sg"
  description = "Security group for databases"
  vpc_id      = aws_vpc.vpc.id
}

# Security Group Rules
resource "aws_security_group_rule" "ssh_bastion_ingress" {
  type              = "ingress"
  from_port         = 22
  to_port           = 22
  protocol          = "tcp"
  cidr_blocks       = ["0.0.0.0/0"]
  security_group_id = aws_security_group.ssh_bastion.id
}

resource "aws_security_group_rule" "ssh_bastion_egress_frontend" {
  type              = "egress"
  from_port         = 22
  to_port           = 22
  protocol          = "tcp"
  source_security_group_id = aws_security_group.frontend_app.id
  security_group_id = aws_security_group.ssh_bastion.id
}

resource "aws_security_group_rule" "ssh_bastion_egress_backend" {
  type              = "egress"
  from_port         = 22
  to_port           = 22
  protocol          = "tcp"
  source_security_group_id = aws_security_group.backend_app.id
  security_group_id = aws_security_group.ssh_bastion.id
}

resource "aws_security_group_rule" "app_lb_ingress_http" {
  type              = "ingress"
  from_port         = 80
  to_port           = 80
  protocol          = "tcp"
  cidr_blocks       = ["0.0.0.0/0"]
  security_group_id = aws_security_group.app_lb.id
}

resource "aws_security_group_rule" "app_lb_egress" {
  type              = "egress"
  from_port         = 0
  to_port           = 0
  protocol          = "-1"
  cidr_blocks       = ["0.0.0.0/0"]
  security_group_id = aws_security_group.app_lb.id
}

# Frontend App Rules
resource "aws_security_group_rule" "Frontend_app_ingress_ssh" {
  type              = "ingress"
  from_port         = 22
  to_port           = 22
  protocol          = "tcp"
  source_security_group_id = aws_security_group.ssh_bastion.id
  security_group_id = aws_security_group.frontend_app.id
}

resource "aws_security_group_rule" "Frontend_app_ingress_http" {
  type              = "ingress"
  from_port         = 3000
  to_port           = 3000
  protocol          = "tcp"
  source_security_group_id = aws_security_group.app_lb.id
  security_group_id = aws_security_group.frontend_app.id
}

resource "aws_security_group_rule" "Frontend_app_ingress_backend" {
  type              = "ingress"
  from_port         = 3000
  to_port           = 3000
  protocol          = "tcp"
  source_security_group_id = aws_security_group.backend_app.id
  security_group_id = aws_security_group.frontend_app.id
}

resource "aws_security_group_rule" "Frontend_app_egress" {
  type              = "egress"
  from_port         = 0
  to_port           = 0
  protocol          = "-1"
  cidr_blocks       = ["0.0.0.0/0"]
  security_group_id = aws_security_group.frontend_app.id
}

# Backend App Rules
resource "aws_security_group_rule" "Backend_app_ingress_ssh" {
  type              = "ingress"
  from_port         = 22
  to_port           = 22
  protocol          = "tcp"
  source_security_group_id = aws_security_group.ssh_bastion.id
  security_group_id = aws_security_group.backend_app.id
}

resource "aws_security_group_rule" "Backend_app_ingress_frontend" {
  type              = "ingress"
  from_port         = 8080
  to_port           = 8080
  protocol          = "tcp"
  source_security_group_id = aws_security_group.frontend_app.id
  security_group_id = aws_security_group.backend_app.id
}

resource "aws_security_group_rule" "Backend_app_egress_mysql" {
  type              = "egress"
  from_port         = 3306
  to_port           = 3306
  protocol          = "tcp"
  source_security_group_id = aws_security_group.databases.id
  security_group_id = aws_security_group.backend_app.id
}

resource "aws_security_group_rule" "Backend_app_egress_mongodb" {
  type              = "egress"
  from_port         = 27017
  to_port           = 27017
  protocol          = "tcp"
  source_security_group_id = aws_security_group.databases.id
  security_group_id = aws_security_group.backend_app.id
}

resource "aws_security_group_rule" "Backend_app_egress" {
  type              = "egress"
  from_port         = 0
  to_port           = 0
  protocol          = "-1"
  cidr_blocks       = ["0.0.0.0/0"]
  security_group_id = aws_security_group.backend_app.id
}

# Database Rules
resource "aws_security_group_rule" "database_ingress_mysql" {
  type              = "ingress"
  from_port         = 3306
  to_port           = 3306
  protocol          = "tcp"
  source_security_group_id = aws_security_group.backend_app.id
  security_group_id = aws_security_group.databases.id
}

resource "aws_security_group_rule" "database_ingress_mongodb" {
  type              = "ingress"
  from_port         = 27017
  to_port           = 27017
  protocol          = "tcp"
  source_security_group_id = aws_security_group.backend_app.id
  security_group_id = aws_security_group.databases.id
}

resource "aws_security_group_rule" "database_egress" {
  type              = "egress"
  from_port         = 0
  to_port           = 0
  protocol          = "-1"
  cidr_blocks       = ["0.0.0.0/0"]
  security_group_id = aws_security_group.databases.id
}
# Load Balancer
resource "aws_lb" "app_lb" {
  name               = "app-lb"
  internal           = false
  security_groups    = [aws_security_group.app_lb.id]
  subnets            = [aws_subnet.DMZ.id, aws_subnet.publicB.id]
  load_balancer_type = "application"
  enable_deletion_protection = false
  tags = {
    Name = "Application Load Balancer"
  }
}

# Target Group for Frontend
resource "aws_lb_target_group" "app_tg" {
  name     = "app-tg"
  port     = 3000
  protocol = "HTTP"
  vpc_id   = aws_vpc.vpc.id
  health_check {
    path                = "/"
    interval            = 30
    timeout             = 5
    healthy_threshold   = 5
    unhealthy_threshold = 3
    matcher             = "200"
  }
}

# Target Group Attachment - attach the frontend instance to the target group
resource "aws_lb_target_group_attachment" "Frontend_1" {
  target_group_arn = aws_lb_target_group.app_tg.arn
  target_id = aws_instance.Frontend_app.id
  port             = 3000
}

# Load Balancer Listener to forward requests to the frontend
resource "aws_lb_listener" "web_app_listener" {
  load_balancer_arn = aws_lb.app_lb.arn
  port              = "80"
  protocol          = "HTTP"

  default_action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.app_tg.arn
  }
}

# SSH Bastion Host Instance
resource "aws_instance" "ssh_bastion" {
  ami             = "ami-06b21ccaeff8cd686"
  instance_type   = "t2.micro" 
  key_name        = "deployer_key" 
  security_groups = [aws_security_group.ssh_bastion.id]
  subnet_id       = aws_subnet.DMZ.id
  tags = {
    Name = "ssh-bastion"
  }
}

# Frontend Application Instance
resource "aws_instance" "Frontend_app" {
  ami             = "ami-06b21ccaeff8cd686"
  instance_type   = "t2.micro" 
  key_name        = "deployer_key"
  security_groups = [aws_security_group.frontend_app.id] # corrected
  subnet_id       = aws_subnet.frontend.id               # corrected
  user_data = <<-EOF
    #!/bin/bash
    sudo yum update -y
    sudo yum install docker -y
    sudo systemctl start docker
    sudo systemctl enable docker
    echo "dckr_pat_WtzZD_tNiDkE7pF0azWJbH-Gx38" | sudo docker login -u "abdayman" --password-stdin
    sudo docker pull abdayman/frontend:latest
    sudo docker run -d -p 3000:3000 --name frontend abdayman/frontend:latest
  EOF

  tags = {
    Name = "frontend-instance"
  }
}

# Backend Application Instance
resource "aws_instance" "Backend_app" {
  ami             = "ami-06b21ccaeff8cd686"
  instance_type   = "t2.micro" 
  key_name        = "deployer_key"
  security_groups = [aws_security_group.backend_app.id]
  subnet_id       = aws_subnet.backend.id
  user_data = <<-EOF
    #!/bin/bash
    sudo apt-get update -y
    sudo apt-get install docker.io -y
    sudo systemctl start docker
    sudo systemctl enable docker
    echo "dckr_pat_WtzZD_tNiDkE7pF0azWJbH-Gx38" | sudo docker login -u "abdayman" --password-stdin
    sudo docker pull abdayman/backend:latest
    sudo docker run -d \
      --name collaborative-editor \
      -p 8080:8080 \
      -e SPRING_APPLICATION_NAME=editor \
      -e JWT_SECRET=dd55wwqq \
      -e SPRING_DATASOURCE_URL=jdbc:mysql://collaborative-mysql:3306/mysql_db \
      -e SPRING_DATASOURCE_USERNAME=root \
      -e SPRING_DATASOURCE_PASSWORD=root \
      -e SPRING_DATA_MONGODB_URI=mongodb://devroot:devroot@collaborative-mongo:27017/mongo_db?authSource=admin \
      abdayman/backend:latest
  EOF

  tags = {
    Name = "backend-instance"
  }
}

# Database Server Instance
resource "aws_instance" "databases" {
  ami             = "ami-06b21ccaeff8cd686"
  instance_type   = "t2.micro" 
  key_name        = "deployer_key" 
  security_groups = [aws_security_group.databases.id]
  subnet_id       = aws_subnet.backend.id
  user_data = <<-EOF
    #!/bin/bash
    sudo apt-get update -y
    sudo apt-get install docker.io -y
    sudo systemctl start docker
    sudo systemctl enable docker
    echo "dckr_pat_WtzZD_tNiDkE7pF0azWJbH-Gx38" | sudo docker login -u "abdayman" --password-stdin
    sudo docker pull mysql:8.0
    sudo docker pull mongo
    sudo docker network create collaborative-network
    
    # Run MySQL container with port 3306 exposed
    sudo docker run -d \
      --name collaborative-mysql \
      --network collaborative-network \
      -p 3306:3306 \
      -e MYSQL_ROOT_PASSWORD=root \
      -e MYSQL_DATABASE=mysql_db \
      mysql:8.0
    
    # Run MongoDB container with port 27017 exposed
    sudo docker run -d \
      --name collaborative-mongo \
      --network collaborative-network \
      -p 27017:27017 \
      -e MONGO_INITDB_ROOT_USERNAME=devroot \
      -e MONGO_INITDB_ROOT_PASSWORD=devroot \
      mongo
  EOF

  tags = {
    Name = "databases"
  }
}