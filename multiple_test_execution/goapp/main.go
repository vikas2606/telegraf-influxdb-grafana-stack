package main

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"strconv"
	"time"

	"github.com/gorilla/websocket"
	_ "github.com/jackc/pgx/v4/stdlib"
)

var upgrader = websocket.Upgrader{
	ReadBufferSize:  1024,
	WriteBufferSize: 1024,
	CheckOrigin: func(r *http.Request) bool {
		return true
	},
}

func main() {

	connStr := "postgres://admin:admin123@timescaledb:5432/admin?sslmode=disable"

	db, err := sql.Open("pgx", connStr)
	if err != nil {
		panic(err)
	}
	defer db.Close()

	// Check if the connection is successful
	err = db.Ping()
	if err != nil {
		panic(err)
	}

	fmt.Println("Connected to TimescaleDB!")

	http.HandleFunc("/ws", func(w http.ResponseWriter, r *http.Request) {
		handleWebSocket(w, r, db)
	})
	http.ListenAndServe(":8080", nil)

}

type ScheduleData struct {
	TimeStamp             time.Time `json:"timestamp"`
	Cells0DlSchedUsersAvg float64   `json:"cells_0_dl_sched_users_avg"`
	Cells0DlSchedUsersMax float64   `json:"cells_0_dl_sched_users_max"`
	Cells0DlSchedUsersMin float64   `json:"cells_0_dl_sched_users_min"`
	Cells0UlSchedUsersAvg float64   `json:"cells_0_ul_sched_users_avg"`
	Cells0UlSchedUsersMax float64   `json:"cells_0_ul_sched_users_max"`
	Cells0UlSchedUsersMin float64   `json:"cells_0_ul_sched_users_min"`
	Cells1DlSchedUsersAvg float64   `json:"cells_1_dl_sched_users_avg"`
	Cells1DlSchedUsersMax float64   `json:"cells_1_dl_sched_users_max"`
	Cells1DlSchedUsersMin float64   `json:"cells_1_dl_sched_users_min"`
	Cells1UlSchedUsersAvg float64   `json:"cells_1_ul_sched_users_avg"`
	Cells1UlSchedUsersMax float64   `json:"cells_1_ul_sched_users_max"`
	Cells1UlSchedUsersMin float64   `json:"cells_1_ul_sched_users_min"`
}

type PacketData struct {
	TimeStamp         time.Time `json:"timestamp"`
	Cells0DlRxCount   float64   `json:"cells_0_dl_rx_count"`
	Cells0DlErrCount  float64   `json:"cells_0_dl_err_count"`
	Cells0UlTxCount   float64   `json:"cells_0_ul_tx_count"`
	Cells0UlRetxCount float64   `json:"cells_0_ul_retx_count"`
	Cells0DlRetxCount float64   `json:"cells_0_dl_retx_count"`
	Cells1DlRxCount   float64   `json:"cells_1_dl_rx_count"`
	Cells1DlErrCount  float64   `json:"cells_1_dl_err_count"`
	Cells1UlTxCount   float64   `json:"cells_1_ul_tx_count"`
	Cells1UlRetxCount float64   `json:"cells_1_ul_retx_count"`
	Cells1DlRetxCount float64   `json:"cells_1_dl_retx_count"`
}

type ThroughputData struct {
	TimeStamp       time.Time `json:"timestamp"`
	Cells0DlBitrate float64   `json:"cells_0_dl_bitrate"`
	Cells0UlBitrate float64   `json:"cells_0_ul_bitrate"`
	Cells1DlBitrate float64   `json:"cells_1_dl_bitrate"`
	Cells1UlBitrate float64   `json:"cells_1_ul_bitrate"`
}

type CombinedResponse struct {
	ScheduledData  []ScheduleData   `json:"scheduled_data"`
	PacketData     []PacketData     `json:"packet_data"`
	ThroughputData []ThroughputData `json:"throughput_data"`
}

func handleWebSocket(w http.ResponseWriter, r *http.Request, db *sql.DB) {
	// Upgrade HTTP connection to WebSocket
	conn, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		log.Println("Error upgrading connection to WebSocket: ", err)
		return
	}
	defer conn.Close()

	for {
		// Read message from frontend
		_, message, err := conn.ReadMessage()
		if err != nil {
			log.Println("Error reading message: ", err)
			break
		}
		log.Printf("Received message: %s\n", message)

		// Convert message to integer
		num, err := strconv.Atoi(string(message))
		if err != nil {
			log.Println("Error converting message to integer:", err)
			break
		}

		// Query cell_data table with specified time range

		packetRows, err := db.Query("SELECT time, cells_0_dl_rx_count, cells_0_dl_err_count, cells_0_ul_tx_count, cells_0_ul_retx_count, cells_1_dl_retx_count, cells_1_dl_rx_count, cells_1_dl_err_count, cells_1_ul_tx_count, cells_1_ul_retx_count, cells_1_dl_retx_count FROM cellslayer WHERE time >= $1", time.Now().Add(time.Duration(-num)*time.Minute))
		if err != nil {
			fmt.Println("Error querying packet_data:", err)
			return
		}
		defer packetRows.Close()

		var responseP []PacketData
		for packetRows.Next() {
			var (
				timeStamp         time.Time
				Cells0DlRxCount   float64
				Cells0DlErrCount  float64
				Cells0UlTxCount   float64
				Cells0UlRetxCount float64
				Cells0DlRetxCount float64
				Cells1DlRxCount   float64
				Cells1DlErrCount  float64
				Cells1UlTxCount   float64
				Cells1UlRetxCount float64
				Cells1DlRetxCount float64
			)
			err := packetRows.Scan(&timeStamp, &Cells0DlRxCount, &Cells0DlErrCount, &Cells0UlTxCount, &Cells0UlRetxCount, &Cells0DlRetxCount, &Cells1DlRxCount, &Cells1DlErrCount, &Cells1UlTxCount, &Cells1UlRetxCount, &Cells1DlRetxCount)
			if err != nil {
				fmt.Println("Error scanning packet_data row:", err)
				return
			}

			responseP = append(responseP, PacketData{
				TimeStamp:         timeStamp,
				Cells0DlRxCount:   Cells0DlRxCount,
				Cells0DlErrCount:  Cells0DlErrCount,
				Cells0UlTxCount:   Cells0UlTxCount,
				Cells0UlRetxCount: Cells0UlRetxCount,
				Cells0DlRetxCount: Cells0DlRetxCount,
				Cells1DlRxCount:   Cells1DlRxCount,
				Cells1DlErrCount:  Cells1DlErrCount,
				Cells1UlTxCount:   Cells1UlTxCount,
				Cells1UlRetxCount: Cells1UlRetxCount,
				Cells1DlRetxCount: Cells1DlRetxCount,
			})
		}
		if err != nil {
			log.Println("Error preparing response message:", err)
			break
		}

		////////////////////////////////////////////////////////////////////////////////////////////////////////
		throughputRows, err := db.Query("SELECT time, cells_0_dl_bitrate, cells_0_ul_bitrate, cells_1_dl_bitrate, cells_1_ul_bitrate FROM cellslayer WHERE time >= $1", time.Now().Add(time.Duration(-num)*time.Minute))
		if err != nil {
			fmt.Println("Error querying throughput_data:", err)
			return
		}
		defer throughputRows.Close()

		var responseT []ThroughputData
		for throughputRows.Next() {
			var (
				timeStamp       time.Time
				Cells0DlBitrate float64
				Cells0UlBitrate float64
				Cells1DlBitrate float64
				Cells1UlBitrate float64
			)
			err := throughputRows.Scan(&timeStamp, &Cells0DlBitrate, &Cells0UlBitrate, &Cells1DlBitrate, &Cells1UlBitrate)
			if err != nil {
				fmt.Println("Error scanning throughput_data row:", err)
				return
			}
			responseT = append(responseT, ThroughputData{
				TimeStamp:       timeStamp,
				Cells0DlBitrate: Cells0DlBitrate,
				Cells0UlBitrate: Cells0UlBitrate,
				Cells1DlBitrate: Cells1DlBitrate,
				Cells1UlBitrate: Cells1UlBitrate,
			})
		}
		if err != nil {
			log.Println("Error preparing response message:", err)
			break
		}

		//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

		scheduledRows, err := db.Query("SELECT time, cells_0_dl_sched_users_avg, cells_0_dl_sched_users_max, cells_0_dl_sched_users_min, cells_0_ul_sched_users_avg, cells_0_ul_sched_users_max, cells_0_ul_sched_users_min, cells_1_dl_sched_users_avg, cells_1_dl_sched_users_max, cells_1_dl_sched_users_min, cells_1_ul_sched_users_avg, cells_1_ul_sched_users_max, cells_1_ul_sched_users_min FROM cellslayer WHERE time >= $1", time.Now().Add(time.Duration(-num)*time.Minute))
		if err != nil {
			fmt.Println("Error querying throughput_data:", err)
			return
		}
		defer scheduledRows.Close()

		var responseS []ScheduleData
		for scheduledRows.Next() {
			var (
				timeStamp             time.Time
				Cells0DlSchedUsersAvg float64
				Cells0DlSchedUsersMax float64
				Cells0DlSchedUsersMin float64
				Cells0UlSchedUsersAvg float64
				Cells0UlSchedUsersMax float64
				Cells0UlSchedUsersMin float64
				Cells1DlSchedUsersAvg float64
				Cells1DlSchedUsersMax float64
				Cells1DlSchedUsersMin float64
				Cells1UlSchedUsersAvg float64
				Cells1UlSchedUsersMax float64
				Cells1UlSchedUsersMin float64
			)
			err := scheduledRows.Scan(&timeStamp, &Cells0DlSchedUsersAvg, &Cells0DlSchedUsersMax, &Cells0DlSchedUsersMin, &Cells0UlSchedUsersAvg, &Cells0UlSchedUsersMax, &Cells0UlSchedUsersMin, &Cells1DlSchedUsersAvg, &Cells1DlSchedUsersMax, &Cells1DlSchedUsersMin, &Cells1UlSchedUsersAvg, &Cells1UlSchedUsersMax, &Cells1UlSchedUsersMin)
			if err != nil {
				fmt.Println("Error scanning scheduled_data row:", err)
				return
			}
			responseS = append(responseS, ScheduleData{
				TimeStamp:             timeStamp,
				Cells0DlSchedUsersAvg: Cells0DlSchedUsersAvg,
				Cells0DlSchedUsersMax: Cells0DlSchedUsersMax,
				Cells0DlSchedUsersMin: Cells0DlSchedUsersMin,
				Cells0UlSchedUsersAvg: Cells0UlSchedUsersAvg,
				Cells0UlSchedUsersMax: Cells0UlSchedUsersMax,
				Cells0UlSchedUsersMin: Cells0UlSchedUsersMin,
				Cells1DlSchedUsersAvg: Cells1DlSchedUsersAvg,
				Cells1DlSchedUsersMax: Cells1DlSchedUsersMax,
				Cells1DlSchedUsersMin: Cells1DlSchedUsersMin,
				Cells1UlSchedUsersAvg: Cells1UlSchedUsersAvg,
				Cells1UlSchedUsersMax: Cells1UlSchedUsersMax,
				Cells1UlSchedUsersMin: Cells1UlSchedUsersMin,
			})
		}
		if err != nil {
			log.Println("Error preparing response message:", err)
			break
		}

		var combinedResponse CombinedResponse

		combinedResponse.ScheduledData = responseS
		combinedResponse.PacketData = responseP
		combinedResponse.ThroughputData = responseT

		// Convert response to JSON
		jsonResponse, err := json.Marshal(combinedResponse)
		if err != nil {
			log.Println("Error converting response to JSON:", err)
			break
		}

		// Send response message back to frontend
		err = conn.WriteMessage(websocket.TextMessage, jsonResponse)
		if err != nil {
			log.Println("Error sending message: ", err)
			break
		}
	}
}
