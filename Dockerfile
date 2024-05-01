FROM maven:3.8.6-openjdk-11 as builder
LABEL name=GorElectroTrans_Commercial
WORKDIR /app
COPY . /app/.
RUN cd /app
RUN mvn clean package

FROM eclipse-temurin:17-jre-alpine
WORKDIR /app
COPY --from=builder /app/target/*.war /app/*.war
EXPOSE 8082
ENTRYPOINT ["java", "-jar", "/app/*.war"]

