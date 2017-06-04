#!/usr/bin/env bash

askUserChoice() {
    >&2 echo $1
    shift

    index=1
    while [ $# -gt 0 ]; do
        >&2 echo -e "$index.\t$1"
        let index=index+1
        shift
    done

    while true; do
        read -rp "Your choice (default: 1): " choice
         re='^[0-9]+$'
         if [ "$choice" = "" ]; then
            echo 1
            break
         fi
        if [[ "$choice" =~ $re ]] && [ $choice -gt 0 ] && [ $choice -lt $index ]; then
            echo $choice
            break
        fi
        >&2 echo "Invalid choice"
    done
    >&2 echo ""
}

askUserConfirmation() {
    while true; do
        read -rp "$1 [Yn]: " choice
        case $choice in
            'y' | 'Y' | '' | 'o')
                echo true
                break;
            ;;
            'n' | 'n')
                echo false
                break;
            ;;
        esac
        >&2 echo "Invalid choice"
    done
}

action=$(askUserChoice "What action do you want to do?" "Deploy last version" "Dump mongo database" "Restore mongo database")
case $action in
    1)
        #Deploy new version
        lvl=$(askUserChoice "What environment do you want to deploy?" "Production" "Pre production")
        restart=$(askUserConfirmation "Do you want to restart the server at the end?")
        npm=$(askUserConfirmation "Do you want to launch npm install at the end?")

        DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
        cd "$DIR/../"
        git pull
        if [[ $lvl = 1 ]]; then gulp prod:build; else gulp preprod:build; fi
        if $npm; then cd /var/www/dl && npm install; fi
        if $restart; then pm2 restart Eygle_Downloads; fi
    ;;
esac