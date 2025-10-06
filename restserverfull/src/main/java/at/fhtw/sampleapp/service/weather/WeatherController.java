package at.fhtw.sampleapp.service.weather;

import at.fhtw.restserver.http.ContentType;
import at.fhtw.restserver.http.HttpStatus;
import at.fhtw.restserver.server.Response;
import at.fhtw.sampleapp.controller.Controller;
import at.fhtw.sampleapp.dal.UnitOfWork;
import at.fhtw.sampleapp.dal.repository.WeatherRepository;
import at.fhtw.sampleapp.model.Weather;
import com.fasterxml.jackson.core.JsonProcessingException;

import java.util.Collection;

public class WeatherController extends Controller {

    public WeatherController() {
        // Repository pattern wird verwendet
    }

    // GET /weather/:id
    public Response getWeather(String weatherId) {
        UnitOfWork unitOfWork = new UnitOfWork();
        try (unitOfWork){
            Collection<Weather> weatherData = new WeatherRepository(unitOfWork).findWeatherByID(weatherId);

            if (weatherData.isEmpty()) {
                unitOfWork.commitTransaction();
                return new Response(
                        HttpStatus.NOT_FOUND,
                        ContentType.JSON,
                        "{ \"message\" : \"Weather not found\" }"
                );
            }

            String weatherJSON = this.getObjectMapper().writeValueAsString(weatherData);
            unitOfWork.commitTransaction();
            return new Response(
                    HttpStatus.OK,
                    ContentType.JSON,
                    weatherJSON
            );
        } catch (Exception e) {
            e.printStackTrace();

            unitOfWork.rollbackTransaction();
            return new Response(
                    HttpStatus.INTERNAL_SERVER_ERROR,
                    ContentType.JSON,
                    "{ \"message\" : \"Internal Server Error\" }"
            );
        }
    }

    // GET /weather
    public Response getWeather() {
        UnitOfWork unitOfWork = new UnitOfWork();
        try (unitOfWork){
            Collection<Weather> weatherData = new WeatherRepository(unitOfWork).findAllWeather();

            String weatherDataJSON = this.getObjectMapper().writeValueAsString(weatherData);
            unitOfWork.commitTransaction();
            return new Response(
                    HttpStatus.OK,
                    ContentType.JSON,
                    weatherDataJSON
            );
        } catch (Exception e) {
            e.printStackTrace();

            unitOfWork.rollbackTransaction();
            return new Response(
                    HttpStatus.INTERNAL_SERVER_ERROR,
                    ContentType.JSON,
                    "{ \"message\" : \"Internal Server Error\" }"
            );
        }
    }
}