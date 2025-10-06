package at.fhtw.sampleapp.dal.repository;

import at.fhtw.sampleapp.dal.DataAccessException;
import at.fhtw.sampleapp.dal.UnitOfWork;
import at.fhtw.sampleapp.model.Weather;

import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.ArrayList;
import java.util.Collection;

public class WeatherRepository {
    private UnitOfWork unitOfWork;

    public WeatherRepository(UnitOfWork unitOfWork)
    {
        this.unitOfWork = unitOfWork;
    }

    public Collection<Weather> findAllWeather() {
        try (PreparedStatement preparedStatement =
                     this.unitOfWork.prepareStatement("""
                    select * from weather
                    where region = ?
                """))
        {
            preparedStatement.setString(1, "Europe");
            ResultSet resultSet = preparedStatement.executeQuery();
            Collection<Weather> weatherRows = new ArrayList<>();
            while(resultSet.next())
            {
                Weather weather = new Weather(
                        resultSet.getInt(1),
                        resultSet.getString(2),
                        resultSet.getString(3),
                        resultSet.getInt(4));
                weatherRows.add(weather);
            }

            return weatherRows;
        } catch (SQLException e) {
            throw new DataAccessException("Select nicht erfolgreich", e);
        }
    }

    public Collection<Weather> findWeatherByID(String userID) {
        try (Statement statement = this.unitOfWork.createStatement())
        {
            String sql = "select * from weather where id = '" + userID + "'";
            boolean hasResultSet = statement.execute(sql);
            Collection<Weather> weatherRows = new ArrayList<>();

            if (hasResultSet) {
                ResultSet resultSet = statement.getResultSet();
                while(resultSet.next())
                {
                    Weather weather = new Weather(
                            resultSet.getInt(1),
                            resultSet.getString(2),
                            resultSet.getString(3),
                            resultSet.getInt(4));
                    weatherRows.add(weather);
                }
            }

            return weatherRows;
        } catch (SQLException e) {
            throw new DataAccessException("Select nicht erfolgreich", e);
        }
    }
}