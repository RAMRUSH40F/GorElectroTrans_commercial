FROM maven:3.8.6-openjdk-11
WORKDIR /github/build
COPY . .
RUN mvn clean install
EXPOSE 8082
WORKDIR /github/build/target
CMD ["nohup", "java", "-jar", "GorElectroTrans.war", "--server.port=8082","&"]
